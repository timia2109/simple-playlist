import dotenv from "dotenv";

export interface Enviroment {
    port: number;
    clientId: string;
    clientSecret: string;
    url: string;
    host?: string;
    connectionString: string;
    databaseName: string;
    collectionName: string;
    title: string;
    info: string;
    adminSpotifyIds: string[];
}

type envDeclaration = {
    name: string,
    target: keyof Enviroment,
    default?: any,
    converter?: (value: string) => any
};

let enviroment: Enviroment | undefined = undefined;
const mapEnvVars : envDeclaration[] = [
    {
        name: "PORT",
        target: "port",
        converter: parseInt
    },
    {
        name: "CLIENT_ID",
        target: "clientId"
    },
    {
        name: "CLIENT_SECRET",
        target: "clientSecret"
    },
    {
        name: "URL",
        target: "url"
    },
    {
        name: "HOST",
        target: "host",
        default: "0.0.0.0"
    },
    {
        name: "DB",
        target: "connectionString"
    },
    {
        name: "DATABASE_NAME",
        target: "databaseName",
        default: "simple-playlist"
    },
    {
        name: "COLLECTION_NAME",
        target: "collectionName",
        default: "entries"
    },
    {
        name: "TITLE",
        target: "title",
        default: "Simple Playlist"
    },
    {
        name: "INFO",
        target: "info",
        converter: (v) => v === null ? [] : v.split("\n").map(i => i.trim()),
        default: null
    },
    {
        name: "ADMIN_SPOTIFY_IDS",
        target: "adminSpotifyIds",
        converter: (v) => v.split(","),
        default: ""
    }
]

function loadEnviroment() {
    dotenv.config();
    let useEnv : any = {};

    for (let envVarDeclaration of mapEnvVars) {
        let envVar: any = process.env[envVarDeclaration.name];
        if (envVar === undefined) {
            // Is there a default value? (=> is optional)
            if (envVarDeclaration.default !== undefined) {
                envVar = envVarDeclaration.default;
            }
            // Need to be declared
            else {
                throw new Error(`Enviroment Variable ${envVarDeclaration.name} must be defined!`);
            }
        }

        // Append Converter
        if (envVarDeclaration.converter !== undefined) {
            envVar = envVarDeclaration.converter(envVar);
        }

        useEnv[envVarDeclaration.target] = envVar;
    }

    enviroment = useEnv as Enviroment;
}

export function getEnviroment() : Enviroment {
    if (enviroment === undefined) {
        loadEnviroment();
    }
    return enviroment as Enviroment;
}