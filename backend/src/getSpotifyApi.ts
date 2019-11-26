import SpotifyWebApi = require("spotify-web-api-node");
import getSpotifyAppToken from "./getSpotifyAppToken";

export default async function getSpotifyApi(clientId: string, clientSecret: string, redirectUri?: string) : Promise<SpotifyWebApi> {
    let token = await getSpotifyAppToken(clientId, clientSecret);
    if (redirectUri) {
        let append = "api/login_callback";
        if (redirectUri[redirectUri.length-1] !== "/") {
            append += "/";
        }
        redirectUri += append;
    }

    let api = new SpotifyWebApi({
        clientId, clientSecret, redirectUri
    });
    api.setAccessToken(token.access_token);
    return api;
}