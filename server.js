const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "hO2yZ8lxM3axUxL8OeKX";

app.get("/", (req, res) => {
    res.send("ElevenLabs Roblox TTS Server Running");
});

app.post("/tts", async (req, res) => {
    try {

        const text = req.body.text;

        if (!text) {
            return res.status(400).json({
                success: false,
                error: "No text"
            });
        }

        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            {
                text: text,
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

        const audioBase64 = Buffer.from(response.data).toString("base64");

        res.json({
            success: true,
            audio: audioBase64
        });

    } catch (err) {

        console.error(err?.response?.data || err);

        res.status(500).json({
            success: false,
            error: "TTS Failed"
        });
    }
});

app.get("/testtts", async (req, res) => {

    try {

        const response = await axios.post(
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

        console.error(err?.response?.data || err);

        res.status(500).send("TTS FAILED");
    }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`TTS Server Running On ${PORT}`);
});
