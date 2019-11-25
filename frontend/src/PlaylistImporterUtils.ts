import SpotifyWebApi from "spotify-web-api-node";

export type ProgressState = "Nothing" | "Pending" | "Success";
export type LoadingHandler = (progressState: ProgressState) => any;
export interface PlaylistImporterValues {
    trackIds: string[],
    api: SpotifyWebApi,
    loadingHandler: LoadingHandler,
    me: SpotifyApi.CurrentUsersProfileResponse
}

export function filterPlaylists(playlists: SpotifyApi.PlaylistObjectSimplified[], me: SpotifyApi.CurrentUsersProfileResponse): SpotifyApi.PlaylistObjectSimplified[] {
    return playlists.filter(p =>
        p.collaborative || p.owner.id == me.id
    ).sort((a, b) => a.name.localeCompare(b.name));
}

export async function createPlaylist(name: string, values: PlaylistImporterValues) : Promise<void> {
    const { api, loadingHandler, me } = values;
    loadingHandler("Pending");

    let playlist = await api.createPlaylist(me.id, name, {
        public: false,
        collaborative: false
    });

    let playlistId = playlist.body.id;

    await addTracksToPlaylist(playlistId, values);
    loadingHandler("Success");
}

async function addTracksToPlaylist(playlistId: string, values: PlaylistImporterValues) : Promise<void> {
    // Spotify has a limit. Max 100 Tracks can add with one request
    for (let tracks of splitArray(values.trackIds, 100)) {
        // No Promise.all bc. API Request Limit
        await values.api.addTracksToPlaylist(playlistId, tracks);
    }
}

function splitArray<T>(items: T[], size: number) : T[][] {
    let arrays: T[][] = [];
    for (let i=0; i < items.length; i+= size) {
        arrays.push(
            items.slice(i, i+size)
        );
    }
    return arrays;
}