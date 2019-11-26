import moment from "moment";
import fetch from "node-fetch";
import { getEnviroment } from "./Enviroment";

export type SpotifyAppToken = {
    access_token: string;
    expires_on: moment.Moment | string;
}

let token : SpotifyAppToken | undefined = undefined;
const env = getEnviroment();

export default async function getSpotifyAppToken() : Promise<SpotifyAppToken> {
    if (token === undefined || moment().isSameOrAfter(token.expires_on)) {
        let auth = (Buffer.from(env.clientId + ":" + env.clientSecret).toString("base64"));
        
        let body = new URLSearchParams();
        body.set("grant_type", "client_credentials");

        let requestInfo = {
            method: "POST",
            body: body as any,
            headers: {
                Authorization: "Basic " + auth
            }
        };

        let resp = await fetch("https://accounts.spotify.com/api/token", requestInfo);
        let respBody = await resp.json();
        token = {
            access_token: respBody.access_token,
            expires_on: moment().add(respBody.expires_in, "seconds")
        };
    }

    return token;
}