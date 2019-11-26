import express, { static as staticFiles } from "express";
import { json } from "body-parser";
import getSpotifyAppToken from "./getSpotifyAppToken";
import cookieParser from "cookie-parser";
import { getTracks, getAllTrackIds } from "./getTracks";
import submitTrack from "./api/submitTrack";
import { loginHandler, loginSuccessHandler } from "./api/loginHandlers";
import { getEnviroment } from "./Enviroment";
import isAdmin from "./isAdmin";
import { deleteTrack, undeleteTrack } from "./api/deleteTrack";

const env = getEnviroment();

const app = express();
app.use(json());
app.use(cookieParser());
app.use((req, res, next) => {
    res.header("X-Powered-By", "timia2109/simple-playlist");
    next();
});

if (process.env.FILES) {
    app.use(staticFiles(process.env.FILES));
}

// Fetch all Tracks
app.get("/api/tracks", async (req, res) => {
    let page = req.query.page || "0";
    let pageNumber = parseInt(page);
    res.send(await getTracks(pageNumber, await isAdmin(req.cookies["userToken"])));
});

// Fetch all TrackIds
app.get("/api/tracks/ids", async (req, res) => {
    res.send(await getAllTrackIds());
});

// Submit any Track
app.post("/api/submit", submitTrack());

// Node for delete track
app.delete("/api/tracks/:trackId", deleteTrack());

// Node for undelete a track
app.post("/api/tracks/:trackId", undeleteTrack());

// Get the App Access Token (User)
app.get("/api/getSpotifyToken", async (req, res) => {
    res.send(
        await getSpotifyAppToken()
    )
});

// Login the User
app.get("/api/login", loginHandler());

// Login okay
app.get("/api/login_callback", loginSuccessHandler());

// App Info & Branding
app.get("/api/info", async (req, res) => {
    res.send({
        title: env.title,
        info: env.info,
        isAdmin: await isAdmin(req.cookies["userToken"])
    });
});

app.listen(
    env.port,
    env.host,
    () => {
        console.log(`Listen on Port ${env.port}`);
        console.log(`    with Root URI: ${env.url}`)
    });