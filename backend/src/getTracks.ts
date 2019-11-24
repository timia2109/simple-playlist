import getCollection from "./database/getDatabaseConnection";
import { EntryResult } from "./api/EntryResult";

const PAGE_LIMIT = 25;

export async function getTracks(page: number) : Promise<EntryResult> {
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
                $skip: page * PAGE_LIMIT
            },
            {
                $limit: PAGE_LIMIT
            }
        ])
        .toArray();

    return {
        entries,
        page,
        pages: Math.ceil( count / PAGE_LIMIT )
    }
}

export async function getAllTrackIds() : Promise<string[]> {
    let collection = await getCollection();
    let entries = await collection
        .aggregate([
            {
                $project: {
                    id: 1
                }
            }
        ])
        .toArray();

    return entries.map(o => o.id);
}