import { MongoClient, Db, Collection } from "mongodb";
import { Entry } from "./Entry";

let database : Db | undefined = undefined;
let collection: Collection<Entry> | undefined;

const connect = async () => {
    console.log("Connect to MongoDb...");

    // as any cuz types version is older then lib version
    const client = new MongoClient(process.env.DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as any);
    await client.connect();

    const dbName = process.env.DATABASE_NAME || "simple-playlist";
    const collectionName = process.env.COLLECTION_NAME || "entries"
    
    database = client.db(dbName);
    await database.createCollection(collectionName);
    collection = database.collection<Entry>(collectionName);
    await collection.createIndex("id", {
        unique: true,
        name: "spotifyIdIndex"
    });

    console.log("Connected!");
}

/**
 * Gets the MongoDB Collection for the App
 */
export default async function getCollection() : Promise<Collection<Entry>> {
    
    if (collection === undefined) {
        await connect();
    }
    
    return collection;
}