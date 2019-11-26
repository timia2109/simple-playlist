# Simple Playlist
[![Actions Status](https://github.com/timia2109/simple-playlist/workflows/Docker%20Image%20Build%20and%20Publish/badge.svg)](https://github.com/timia2109/simple-playlist/actions)

Simple WebApp for easy web-based creation of Spotify Playlists.
This App has been created to use it with Docker.   
We provide a pre-builded Docker image.

Build with React, TypeScript, NodeJS, ExpressJS, MongoDB, Docker, i18next and more.

## Problems? Ideas?
Feel free to open an [issue](https://github.com/timia2109/simple-playlist/issues/new).

Or if you need help you can contact me on [Discord](https://discord.gg/ZzPXV3c)

## How To Run (with Docker)
Install Docker and Docker-Compose, download the [docker-compose.yml](https://github.com/timia2109/simple-playlist/blob/master/docker-compose.yml), place it in a folder and run `docker-compose up -d`.
Default Port is 3000.

Or set it up by yourself with the Docker Image [timia2109/simple-playlist](https://hub.docker.com/repository/docker/timia2109/simple-playlist)

You need a client ID and a client secret from the [Spotify Developers Portal](https://developer.spotify.com/dashboard/applications)

It's recommend to hide the App behind a reverse proxy.

## Configuration
You can configure the app with enviroment variables. See [here](./backend/src/Enviroment.ts).

The following variables are defined:

(Bold titles are required)

|Field|Description|
|-----|-----------|
|**PORT**|Port of the server (backend on dev/fullstack on production)|
|**CLIENT_ID**|Spotify Client Id|
|**CLIENT_SECRET**|Spotify Client Secret|
|**URL**|URL of the server **(the public url)**|
|**DB**|MongoDB connection string|
|HOST|Host to listen *(default = 0.0.0.0)* **Recommend to set this to 127.0.0.1**|
|NODE_ENV|Node environment of the server *(default = production)*|
|DATABASE_NAME|Name of the MongoDB *(default = simple-playlist)*|
|COLLECTION_NAME|Name of the MongoDB collection *(default = entires)*|
|TITLE|Branding of the App (example: "My playlist", *default = Simple Playlist*)|
|INFO|Infotext (appears as alerts. Split by `\n`, *default = ""*)|
|ADMIN_SPOTIFY_IDS|Spotify IDs of users that are admins (can delete Tracks). Comma separated *(default = "")*|

## Develop
Please ensure you have NodeJS and MongoDB installed.

For Backend: Run in the `/backend` folder `npm install` (to get the dependencys), create a `.env` file with the configuration like:

```
PORT=3001
NODE_ENV=development
CLIENT_ID=XXXXX
CLIENT_SECRET=XXXXX
URL=http://localhost:3000
DB=mongodb://localhost:27017
```
*(URL should be the port of the frontend server; other environment varibales are also allowed)*
and run `npm run debug`

For Frondend: Run in the `/frontend` folder `npm install` (to get the dependencys) and then `npm run start`.

The frontend server supports autoreload, whereas the backend server doesn't.
