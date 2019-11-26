# Simple Playlist
Simple WebApp for easy web-based creation of Spotify Playlists.
This App was builded for use with Docker. We have a pre-builded Dockerimage.

Build with React, TypeScript, NodeJS, Express, MongoDB, Docker and more.

i18n Support

Questions, Need Help? Write me on [Discord](https://discord.gg/ZzPXV3c)

## How To Run
Install Docker and Docker-Compose, download the [docker-compose.yml](./docker-compose.yml), place it in a folder and run `docker-compose up -d`.
Default Port is 3000.

Or set it up by yourself with the Docker Image [timia2109/simple-playlist](https://hub.docker.com/repository/docker/timia2109/simple-playlist)

You need a client id and a client secret from the [Spotify Developers Portal](https://developer.spotify.com/dashboard/applications)

It's recommend to hide the App behind a reverse proxy.

## Configuration
You can configure the app with enviroment variables.
The following variables are defined:

(Bold titles are required)

|Field|Description|
|-----|-----------|
|HOST|Host to Listen *(default = 0.0.0.0)* **Recommend to set this to 127.0.0.1**|
|**PORT**|Port of the server (backend on dev / fullstack on production)|
|NODE_ENV|Node Enviroment of the Server *(default = production)*|
|**CLIENT_ID**|Spotify Client Id|
|**CLIENT_SECRET**|Spotify Client Secret|
|**URL**|URL where the server runs **(the public url)**|
|**DB**|MongoDB Connection String|
|DATABASE_NAME|Name of the MongoDB *(default = simple-playlist)*|
|COLLECTION_NAME|Name of the MongoDB Collection *(default = entires)*|
|TITLE|Branding of the App (example: "My Playlist", *default = Simple Playlist*)|
|INFO|Infotext (appears as Alert. Spilt by `\n`, *default = ""*)|

## Develop
Ensure you have NodeJS and MongoDB installed.

For Backend: Run in the `/backend` Folder `npm install` (to get the dependencys), create a `.env` File with the Configuration like:

```
PORT=3001
NODE_ENV=development
CLIENT_ID=XXXXX
CLIENT_SECRET=XXXXX
URL=http://localhost:3000
DB=mongodb://localhost:27017
```
*(URL should be the Port of the frontend server)*
and run `npm run debug`

For Frondend: Run in the `/frontend` Folder `npm install` (to get the dependencys) and then `npm run start`.

The frontend server supports autoreload, the backend server not.