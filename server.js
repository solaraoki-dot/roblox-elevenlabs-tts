const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "hO2yZ8lxM3axUxL8OeKX";

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

        if (err.response?.data) {
            console.error(
                Buffer.from(err.response.data).toString()
            );
        } else {
            console.error(err);
        }

        res.status(500).send("TTS FAILED");
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

       console.error(
    JSON.stringify(
        JSON.parse(Buffer.from(err.response.data).toString()),
        null,
        2
    )
);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`TTS Server Running On ${PORT}`);
});
