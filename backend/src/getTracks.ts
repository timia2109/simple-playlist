import getCollection from "./database/getDatabaseConnection";
import { EntryResult } from "./api/EntryResult";
import MetaInfo from "./database/MetaInfo";

const PAGE_LIMIT = 20;

const DefaultAggregationOptions: any = [
    // Hide Banned / Deleted Entries
    {
        $match: {
            banned: {
                $ne: true
            }
        }
    }
]

export async function getTracks(offset: number, isAdmin: boolean): Promise<EntryResult> {
    let collection = await getCollection();

    let count = await collection.find({
        banned: {
            $ne: true
        }
    }).count();

    let aggregationOptions = [
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
    ];

    // When user is admin dont hide banned entries
    if (!isAdmin) {
        aggregationOptions = DefaultAggregationOptions.concat(aggregationOptions);
    }

    let entries = await collection
        .aggregate(aggregationOptions)
        .toArray();

    return {
        entries,
        items: count,
        offset,
        size: PAGE_LIMIT
    }
}

export async function getAllTrackIds(): Promise<string[]> {
    let collection = await getCollection();
    let entries = await collection
        .aggregate(DefaultAggregationOptions.concat([
            {
                $project: {
                    uri: 1
                }
            }
        ]))
        .toArray();

    return entries.map(o => o.uri);
}

export async function getMetaInfo(): Promise<MetaInfo> {
    const collection = await getCollection();
    const results = await collection.aggregate<MetaInfo>(
        [
            {
                $unwind: '$votes'
            }, {
                $group: {
                    '_id': 'MetaInfo',
                    'lastVote': {
                        '$max': '$votes.created'
                    },
                    'firstVote': {
                        '$min': '$votes.created'
                    },
                    'trackLengthMs': {
                        '$sum': '$duration_ms'
                    }
                }
            }
        ]
    ).toArray();
    return results[0];
}