import express, { static as staticFiles } from "express";
import { json } from "body-parser";
import getSpotifyAppToken from "./getSpotifyAppToken";
import cookieParser from "cookie-parser";
import { getTracks, getAllTrackIds } from "./getTracks";
import submitTrack from "./api/submitTrack";
import { loginHandler, loginSuccessHandler } from "./api/loginHandlers";
import dotenv from "dotenv";
import { getEnviroment } from "./Enviroment";

dotenv.config();

const env = getEnviroment();

const app = express();
app.use(json());
app.use(cookieParser());
app.use((req,res,next)=> {
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
    res.send(await getTracks(pageNumber));
});

// Fetch all TrackIds
app.get("/api/tracks/ids", async (req, res) => {
    res.send(await getAllTrackIds());
});

// Submit any Track
app.post("/api/submit", submitTrack());

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
app.get("/api/info", (req, res) => {
    res.send({});
});

app.listen(
    env.port,
    env.host,
    () => {
        console.log(`Listen on Port ${env.port}`);
        console.log(`    with Root URI: ${env.url}`)
    });