import { EntryResult } from "../../backend/src/api/EntryResult";
import { SpotifyAppToken } from "../../backend/src/getSpotifyAppToken";
import { UserToken } from "../../backend/src/database/UserToken";
import Cookies from "js-cookie";

// More are not nessessary on this app
export type Method = "GET" | "POST";

export default class API {

    private async fetch<TBody, TResponse>(uri: string, method: Method, body?: TBody, query?: URLSearchParams): Promise<TResponse> {
        let requestInit: RequestInit = {
            method
        };

        let baseUrl = window.location.protocol + "//" + window.location.host + "/";

        let url = new URL(uri, baseUrl);

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

    getTracks(page: number): Promise<EntryResult> {
        let searchParams = new URLSearchParams();
        searchParams.set("page", page.toString());
        return this.fetch("/api/tracks", "GET", undefined, searchParams);
    }

    getTrackIds() : Promise<string[]> {
        return this.fetch("/api/tracks/ids", "GET");
    }

    submitTrack(spotifyTrackId: string) : Promise<EntryResult> {
        let body = {
            trackId: spotifyTrackId
        };
        return this.fetch("/api/submit", "POST", body);
    }

    getSpotifyAccessToken() : Promise<SpotifyAppToken> {
        return this.fetch("/api/getSpotifyToken", "GET");
    }

    getUserToken() : UserToken | undefined {
        let cookieContent = Cookies.get("userToken");
        if (cookieContent !== undefined) {
            return JSON.parse(cookieContent);
        }
    }

    getLoginUrl() : string {
        return "/api/login";
    }

}