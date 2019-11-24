import { RequestHandler } from "express";
import getSpotifyApi from "../getSpotifyApi";
import { UserToken } from "../database/UserToken";
import moment from "moment";

export function loginHandler(clientId: string, clientSec: string, url: string) : RequestHandler {
    const handler : RequestHandler =  async (req, res) => {
        let api = await getSpotifyApi(clientId, clientSec, url);
    
        let existing : UserToken | undefined = req.cookies.userToken !== undefined ? JSON.parse(req.cookies.userToken) : undefined;
    
        // Has the user already an existing token?
        if (existing !== undefined && moment().isBefore(existing.expires_on)) {
            res.redirect(url);
        }
    
        let authUrl = api.createAuthorizeURL([
            "playlist-read-private",
            "playlist-read-collaborative",
            "user-library-read",
            "playlist-modify-private",
            "playlist-modify-public"
        ], "simple-playlist-auth");
        res.redirect(authUrl);
    }

    return handler;
}

export function loginSuccessHandler(clientId: string, clientSec: string, url: string) : RequestHandler {
    const handler : RequestHandler = async (req, res) => {
        let code = req.query.code;
        let state = req.query.state;
        if (state !== "simple-playlist-auth") {
            res.send("State missmatch");
            return;
        }
    
        let api = await getSpotifyApi(clientId, clientSec, url);
        let userAccessToken = await api.authorizationCodeGrant(code);
        let userToken : UserToken = {
            access_token: userAccessToken.body.access_token,
            expires_on: moment().add(userAccessToken.body.expires_in, "seconds").toISOString(),
            refresh_token: userAccessToken.body.refresh_token
        };
        res.cookie("userToken", JSON.stringify(userToken));
        res.redirect(url);
    }
    return handler; 
}