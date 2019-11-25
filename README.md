# Simple Playlist
Simple WebApp for easy web-based creation of Spotify Playlists.
This App was builded for use with Docker. We have a pre-builded Dockerimage.

Run:
`docker start timia2109/simple-playlist`

## Configuration
You can configure the app with enviroment variables.
The following variables are defined:

|Field|Description|
|-----|-----------|
|PORT|Port of the server (backend on dev / fullstack on production)|
|NODE_ENV|Node Enviroment of the Server *(default = production)*|
|CLIENT_ID|Spotify Client Id|
|CLIENT_SECRET|Spotify Client Secret|
|URL|URL where the server runs **(the public url)**|
|DB|MongoDB Connection String|
|DATABASE_NAME|Name of the MongoDB *(default = simple-playlist)*|
|COLLECTION_NAME|Name of the MongoDB Collection *(default = entires)*

## Requires
 - Node.JS 
 - MongoDB
 - Docker *(recommend)*