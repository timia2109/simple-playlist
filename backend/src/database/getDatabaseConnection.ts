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
    
    database = client.db("simple-playlist");
    await database.createCollection("entries");
    collection = database.collection<Entry>("entries");
    await collection.createIndex("id", {
        unique: true,
        name: "spotifyIdIndex"
    });

    console.log("Connected!");
}

/**
 * Gets the Collection for the App
 */
export default async function getCollection() : Promise<Collection<Entry>> {
    
    if (collection === undefined) {
        await connect();
    }
    
    return collection;
}