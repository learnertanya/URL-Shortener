import express from "express";
import URL from "../models/url.mjs";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const allurls = await URL.find({});
        return res.render("home", {
            urls: allurls,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

export { router };
