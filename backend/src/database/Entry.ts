import { Vote } from "./Vote";

export type Entry = {
    votes: Vote[]
    lastVote?: Date | string
    banned?: boolean
} & SpotifyApi.TrackObjectFull