const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const DATA_FILE = "./donations.json";

let donations = [];
let latestId = 0;

if (fs.existsSync(DATA_FILE)) {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
        donations = data.donations || [];
        latestId = data.latestId || 0;
    } catch (e) {
        console.log("Failed loading donations.json");
    }
}

function saveData() {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify({
            latestId,
            donations
        }, null, 2)
    );
}

app.post("/webhook/saweria", (req, res) => {
    try {

        const payload = req.body;

        latestId++;

        const donation = {
            id: latestId.toString(),
            donator_name:
                payload.supporter_name ||
                payload.name ||
                "Anonymous",

            amount_raw:
                Number(payload.amount) ||
                Number(payload.vote_quantity) ||
                0,

            message:
                payload.message ||
                ""
        };

        donations.push(donation);

        if (donations.length > 500) {
            donations.shift();
        }

        saveData();

        console.log("Donation:", donation);

        return res.status(200).json({
            success: true
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false
        });
    }
});

app.get("/get-donation", (req, res) => {

    const afterId = req.query.after_id;

    let result = [];

    if (afterId) {
        result = donations.filter(
            d => Number(d.id) > Number(afterId)
        );
    }

    res.json({
        success: true,
        latest_id: latestId.toString(),
        donations: result
    });
});

app.get("/", (req, res) => {
    res.send("Saweria API Running");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
