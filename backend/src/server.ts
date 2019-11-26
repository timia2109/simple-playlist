import express, { static as staticFiles } from "express";
import { json } from "body-parser";
import getSpotifyAppToken from "./getSpotifyAppToken";
import cookieParser from "cookie-parser";
import { getTracks, getAllTrackIds } from "./getTracks";
import submitTrack from "./api/submitTrack";
import { loginHandler, loginSuccessHandler } from "./api/loginHandlers";
import dotenv from "dotenv";

dotenv.config();

const port = parseInt(process.env.PORT);
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const url = process.env.URL;
// Branding
const appInfo = {
    title: process.env.TITLE || "Simple Playlist",
    info: (process.env.INFO && process.env.INFO.split("\n").map(i => i.trim()))
        || []
};

const app = express();
//app.use(cors());
app.use(json());
app.use(cookieParser());

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
app.post("/api/submit", submitTrack(clientId, clientSecret));

// Get the App Access Token (User)
app.get("/api/getSpotifyToken", async (req, res) => {
    res.send(
        await getSpotifyAppToken(clientId, clientSecret)
    )
});

// Login the User
app.get("/api/login", loginHandler(clientId, clientSecret, url));

// Login okay
app.get("/api/login_callback", loginSuccessHandler(clientId, clientSecret, url));

// App Info & Branding
app.get("/api/info", (req, res) => {
    res.send(appInfo);
});

app.listen(
    port,
    process.env.HOST || "0.0.0.0",
    () => {
        console.log(`Listen on Port ${port}`);
        console.log(`    with Root URI: ${url}`)
    });