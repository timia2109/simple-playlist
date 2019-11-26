import { Vote } from "../database/Vote";
import getCollection from "../database/getDatabaseConnection";
import getSpotifyApi from "../getSpotifyApi";
import { Entry } from "../database/Entry";
import { getTracks } from "../getTracks";
import { RequestHandler } from "express";
import { getEnviroment } from "../Enviroment";

export default function submitTrack() : RequestHandler {
    const env = getEnviroment();
    const handler : RequestHandler = async (req, res) => {
        let trackId = req.body.trackId;
        let vote: Vote = {
            created: new Date(),
            ipAddress: req.ip
        };
        let collection = await getCollection();
    
        let dbEntry = await collection.findOne({
            id: trackId
        });
    
        // Already voted?
        if (dbEntry !== null) {
            await collection.updateOne({ id: trackId }, {
                $push: {
                    votes: vote
                }
            });
        }
        else {
            let api = await getSpotifyApi(env.clientId, env.clientSecret);
            let spotifyTrack = await api.getTrack(trackId);
    
            // Hide Market Fields
            spotifyTrack.body.album.available_markets = [];
            spotifyTrack.body.available_markets = [];
    
            let entry: Entry = {
                ...spotifyTrack.body,
                votes: [vote]
            };
            await collection.insertOne(entry);
        }
    
        // Return all Tracks (for refresh)
        res.send(await getTracks(0));
    }
    return handler;
}