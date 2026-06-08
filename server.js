const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "hO2yZ8lxM3axUxL8OeKX";

console.log("ELEVENLABS KEY FOUND:", !!API_KEY);

app.get("/", (req, res) => {
    res.send("ElevenLabs Roblox TTS Server Running");
});

app.get("/testtts", async (req, res) => {
    try {

        await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            {
                text: "Hello from Roblox donation system",
                model_id: "eleven_multilingual_v2"
            },
            {
                responseType: "arraybuffer",
                headers: {
                    "xi-api-key": API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        res.send("TTS SUCCESS");

    } catch (err) {

        console.log("===== TEST TTS ERROR =====");

        if (err.response?.data) {
            console.log(
                Buffer.from(err.response.data).toString("utf8")
            );
        }

        console.log(err.message);

        res.status(500).send("TTS FAILED");
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`TTS Server Running On ${PORT}`);
});
