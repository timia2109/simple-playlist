import SpotifyWebApi = require("spotify-web-api-node");
import getSpotifyAppToken from "./getSpotifyAppToken";
import { getEnviroment } from "./Enviroment";

const env = getEnviroment();

export default async function getSpotifyApi() : Promise<SpotifyWebApi> {
    let token = await getSpotifyAppToken();
    let redirectUri = env.url;
    if (redirectUri) {
        let append = "api/login_callback";
        if (redirectUri[redirectUri.length-1] !== "/") {
            append = "/" + append;
        }
        redirectUri += append;
    }

    let api = new SpotifyWebApi({
        clientId: env.clientId, 
        clientSecret: env.clientSecret, 
        redirectUri
    });
    api.setAccessToken(token.access_token);
    return api;
}