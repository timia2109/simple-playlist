import API from "./API";
import { SpotifyAppToken } from "../../backend/src/getSpotifyAppToken";

export interface DefaultComponentProps {
    api: API;
    spotifyToken: SpotifyAppToken;
}