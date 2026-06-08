const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.get("/", (req, res) => {
    res.send("OpenAI Roblox TTS Server Running");
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
            "https://api.openai.com/v1/audio/speech",
            {
                model: "gpt-4o-mini-tts",
                voice: "alloy",
                input: text
            },
            {
                responseType: "arraybuffer",
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
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

        console.error(err.response?.data || err.message);

        res.status(500).json({
            success: false,
            error: "TTS Failed"
        });
    }
});

app.get("/testtts", async (req, res) => {

    try {

        await axios.post(
            "https://api.openai.com/v1/audio/speech",
            {
                model: "gpt-4o-mini-tts",
                voice: "alloy",
                input: "Hello from Roblox donation system"
            },
            {
                responseType: "arraybuffer",
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.send("TTS SUCCESS");

    } catch (err) {

    console.log("===== OPENAI ERROR =====");

    if (err.response?.data) {

        try {
            console.log(
                Buffer.from(err.response.data).toString("utf8")
            );
        } catch (e) {
            console.log(err.response.data);
        }

    } else {
        console.log(err.message);
    }

    res.status(500).send("TTS FAILED");
}
