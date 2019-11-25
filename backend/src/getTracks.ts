import getCollection from "./database/getDatabaseConnection";
import { EntryResult } from "./api/EntryResult";

const PAGE_LIMIT = 20;

export async function getTracks(offset: number) : Promise<EntryResult> {
    let collection = await getCollection();
    let count = await collection.countDocuments();
    let entries = await collection
        .aggregate([
            {
                $addFields: {
                    "lastVote": {
                        $max: "$votes.created"
                    }
                }
            },
            {
                $sort: {
                    lastVote: -1
                }
            },
            {
                $skip: offset
            },
            {
                $limit: PAGE_LIMIT
            }
        ])
        .toArray();

    return {
        entries,
        items: count,
        offset,
        size: PAGE_LIMIT
    }
}

export async function getAllTrackIds() : Promise<string[]> {
    let collection = await getCollection();
    let entries = await collection
        .aggregate([
            {
                $project: {
                    uri: 1
                }
            }
        ])
        .toArray();

    return entries.map(o => o.uri);
}