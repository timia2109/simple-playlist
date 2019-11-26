import { EntryResult } from "../../backend/src/api/EntryResult";
import { SpotifyAppToken } from "../../backend/src/getSpotifyAppToken";
import { UserToken } from "../../backend/src/database/UserToken";
import Cookies from "js-cookie";
import IEntriesChangeListener from "./IEntriesChangeListener";
import {AppInfo} from "../../backend/src/api/AppInfo";
import moment from "moment";

// More are not nessessary on this app
export type Method = "GET" | "POST" | "DELETE";

export default class API {

    private entriesChangeListener: IEntriesChangeListener[] = [];
    private _info?: AppInfo;

    private async fetch<TBody, TResponse>(uri: string, method: Method, body?: TBody, query?: URLSearchParams): Promise<TResponse> {
        let requestInit: RequestInit = {
            method
        };

        let url = new URL(uri, window.location.href);

        // Append Query Params
        if (query) {
            for (let queryParam of query) {
                url.searchParams.set(queryParam[0], queryParam[1]);
            }
        }

        // Body
        if (body) {
            requestInit.body = JSON.stringify(body);
            requestInit.headers = {
                "Content-Type": "application/json; charset=utf-8"
            }
        }

        let response = await fetch(url.toString(), requestInit);
        return await response.json();
    }

    get info() : AppInfo {
        return this._info!;
    }

    async init() : Promise<void> {
        this._info = await this.fetch("api/info", "GET");
    }

    getTracks(page: number): Promise<EntryResult> {
        let searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        return this.fetch("api/tracks", "GET", undefined, searchParams);
    }

    getTrackIds() : Promise<string[]> {
        return this.fetch("api/tracks/ids", "GET");
    }

    submitTrack(spotifyTrackId: string) : Promise<EntryResult> {
        let body = {
            trackId: spotifyTrackId
        };
        return this.fetch("api/submit", "POST", body);
    }

    async deleteTrack(spotifyTrackId: string) : Promise<void> {
        await this.fetch("api/tracks/" + spotifyTrackId, "DELETE");
        this.notifyEntriesChange();
    }

    async undeleteTrack(spotifyTrackId: string) : Promise<void> {
        await this.fetch("api/tracks/" + spotifyTrackId, "POST");
        this.notifyEntriesChange();
    }

    getSpotifyAccessToken() : Promise<SpotifyAppToken> {
        return this.fetch("api/getSpotifyToken", "GET");
    }

    getUserToken() : UserToken | undefined {
        let cookieContent = Cookies.get("userToken");
        if (cookieContent !== undefined) {
            const userToken = JSON.parse(cookieContent) as UserToken;
            // Only if token is still valid
            if (moment().isBefore(userToken.expires_on)) {
                return userToken;
            }
        }
    }

    getLoginUrl() : string {
        return "api/login";
    }

    attach(iEntriesChangeListener: IEntriesChangeListener) : void {
        this.entriesChangeListener.push(iEntriesChangeListener);
    }

    detach(iEntriesChangeListener: IEntriesChangeListener) : void {
        this.entriesChangeListener = this.entriesChangeListener.filter(l => l !== iEntriesChangeListener);
    }

    notifyEntriesChange() : void {
        this.entriesChangeListener.forEach(l => l.reloadEntries());
    }

}