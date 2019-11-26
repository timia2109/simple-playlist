import { RequestHandler } from "express-serve-static-core";
import { UserToken } from "./database/UserToken";
import moment from "moment";
import SpotifyWebApi from "spotify-web-api-node";
import { getEnviroment } from "./Enviroment";

const env = getEnviroment();

function getMe(accessToken: string) {
    const api = new SpotifyWebApi();
    api.setAccessToken(accessToken);

    return api.getMe();
}

export default async function isAdmin(userTokenCookie: string ) : Promise<boolean> {
    if (userTokenCookie !== undefined) {
        const userToken = JSON.parse(userTokenCookie) as UserToken;
        // Just when its valid. No automatic expand
        if (moment().isBefore(userToken.expires_on)) {
            try {
                const me = await getMe(userToken.access_token);
                return env.adminSpotifyIds.findIndex(id => id == me.body.id) !== -1;
            } catch (e) {
                // Ignore. Will be false
            }
        }
    }

    return false;
}