import { SpotifyUtils } from "../../logic/SpotifyUtils";

export default interface ImporterProps {
    spotifyUtils: SpotifyUtils;
    playlists?: SpotifyApi.PlaylistObjectSimplified[]
}