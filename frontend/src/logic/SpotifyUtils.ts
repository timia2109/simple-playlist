import SpotifyWebApi from "spotify-web-api-node";

interface SpotifyResponse<T> {
    body: T;
    headers: Record<string, string>;
    statusCode: number;
}

export type ProgressState = "Nothing" | "Pending" | "Success";
export type LoadingHandler = (progressState: ProgressState) => any;

export class SpotifyUtils {

    private me?: SpotifyApi.CurrentUsersProfileResponse;
    private _api: SpotifyWebApi;
    private loadingHandler?: LoadingHandler;
    private trackUris?: string[];

    constructor(api: SpotifyWebApi) {
        this._api = api;
    }

    get api(): SpotifyWebApi {
        return this._api;
    }

    async loadMe(): Promise<void> {
        this.me = (await this._api.getMe()).body;
    }

    bindLoadingHandler(loadingHandler: LoadingHandler): SpotifyUtils {
        this.loadingHandler = loadingHandler;
        return this;
    }

    bindTrackUris(trackUris: string[]): SpotifyUtils {
        this.trackUris = trackUris;
        return this;
    }

    async createPlaylist(name: string): Promise<void> {
        if (this.me === undefined) {
            throw new Error("Me is not defined");
        }

        this.loadingHandler && this.loadingHandler("Pending");

        let playlist = await this._api.createPlaylist(this.me.id, name, {
            public: false,
            collaborative: false
        });

        let playlistId = playlist.body.id;

        await this.addTracksToPlaylist(playlistId);
        this.loadingHandler && this.loadingHandler("Success");
    }

    async importPlaylist(playlistId: string, clear: boolean, allowDuplicates: boolean): Promise<void> {

        this.loadingHandler && this.loadingHandler("Pending");

        let playlistTracks: SpotifyApi.PlaylistTrackObject[] = [];
        // Duplicate Array
        let useTrackUris = Array.from(this.trackUris!);

        // Only load Tracks if it is nessessary
        if (clear || !allowDuplicates) {
            playlistTracks = await this.getTracksFromPlaylist(playlistId);
        }

        if (clear) {
            await this.clearPlaylist(playlistId, playlistTracks);
        }

        if (!allowDuplicates) {
            for (let playlistTrack of playlistTracks) {
                useTrackUris = useTrackUris.filter(t => t !== playlistTrack.track.uri);
            }
        }

        console.log(playlistId, useTrackUris);
        await this.addTracksToPlaylist(playlistId, useTrackUris);

        this.loadingHandler && this.loadingHandler("Success");
    }

    private async addTracksToPlaylist(playlistId: string, useTrackUris: string[] | undefined = undefined): Promise<void> {
        if (useTrackUris === undefined) {
            if (this.trackUris === undefined) {
                throw new Error("No Tracks are defined");
            }
            useTrackUris = this.trackUris;
        }

        // Spotify has a limit. Max 100 Tracks can add with one request
        for (let tracks of splitArray(useTrackUris, 100)) {
            // No Promise.all bc. API Request Limit
            await this._api.addTracksToPlaylist(playlistId, tracks);
        }
    }

    getTracksFromPlaylist(playlistId: string): Promise<SpotifyApi.PlaylistTrackObject[]> {
        return this.readAll((offset) => this._api.getPlaylistTracks(playlistId, { offset }));
    }

    async getPlaylists(): Promise<SpotifyApi.PlaylistObjectSimplified[]> {
        let rawPlaylists = await this.readAll((offset) => this._api.getUserPlaylists({ offset }));
        return this.filterPlaylists(rawPlaylists);
    }

    private filterPlaylists(playlists: SpotifyApi.PlaylistObjectSimplified[]): SpotifyApi.PlaylistObjectSimplified[] {
        if (this.me === undefined) {
            throw new Error("Me is not defined");
        }

        return playlists.filter(p =>
            p.collaborative || p.owner.id === this.me!.id
        ).sort((a, b) => a.name.localeCompare(b.name));
    }

    private async clearPlaylist(playlistId: string, dropTracks: SpotifyApi.PlaylistTrackObject[]): Promise<void> {
        for (let tracks of splitArray(dropTracks, 100)) {
            let sTracks = tracks.map(t => { return { uri: t.track.uri } });
            await this._api.removeTracksFromPlaylist(
                playlistId,
                sTracks as any
            );
        }
    }

    async readAll<T>(fetch: (offset: number) => Promise<SpotifyResponse<SpotifyApi.PagingObject<T>>>): Promise<T[]> {
        let items: T[] = [];

        let offset = 0;
        let lastResult: SpotifyApi.PagingObject<T>;

        do {
            let response = await fetch(offset);
            lastResult = response.body;

            items = items.concat(
                lastResult.items
            );

            offset += lastResult.limit;
        } while (lastResult.offset < lastResult.total);

        return items;
    }
}

function splitArray<T>(items: T[], size: number): T[][] {
    let arrays: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        arrays.push(
            items.slice(i, i + size)
        );
    }
    return arrays;
}