const express = require("express");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

let donations = [];
let latestId = 0;

/*
====================================
SAWERIA WEBHOOK
====================================
*/
app.post("/webhook/saweria", (req, res) => {
    try {

        const payload = req.body;

        console.log("===== SAWERIA WEBHOOK =====");
        console.log(JSON.stringify(payload, null, 2));

        latestId++;

        const donation = {
            id: latestId.toString(),

            donator_name:
                payload.supporter_name ||
                payload.donator_name ||
                payload.name ||
                payload.username ||
                "Anonymous",

            amount_raw:
                Number(payload.amount_raw) ||
                Number(payload.amount) ||
                Number(payload.vote_quantity) ||
                0,

            message:
                payload.message ||
                payload.comment ||
                ""
        };

        donations.push(donation);

        if (donations.length > 1000) {
            donations.shift();
        }

        console.log("Donation Saved:", donation);

        return res.status(200).json({
            success: true
        });

    } catch (err) {

        console.error("Webhook Error:", err);

        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

/*
====================================
ROBLOX ENDPOINT
====================================
*/
app.get("/get-donation", (req, res) => {

    try {

        const afterId = req.query.after_id;

        let result;

        if (afterId) {

            result = donations.filter(
                d => Number(d.id) > Number(afterId)
            );

        } else {

            result = donations;
        }

        res.json({
            success: true,
            latest_id: latestId.toString(),
            donations: result
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });
    }
});

/*
====================================
CHECK STATUS
====================================
*/
app.get("/", (req, res) => {

    res.json({
        status: "online",
        latest_id: latestId,
        total_donations: donations.length
    });

});

/*
====================================
DEBUG
====================================
*/
app.get("/debug", (req, res) => {

    res.json({
        latest_id: latestId,
        total_donations: donations.length,
        donations: donations
    });

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
