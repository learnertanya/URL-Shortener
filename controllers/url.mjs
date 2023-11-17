import { nanoid } from "nanoid";
import URL from "../models/url.mjs"; // Note the .js file extension

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "URL is required" });
  const shortId = nanoid(8);
  await URL.create({
    shortId: shortId,
    redirectURL: body.url,
    visitHistory: [],
    createdBy:req.user._id
  });
  return res.render("home",{
    id:shortId,
  })
}
async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

export { handleGenerateNewShortURL, handleGetAnalytics };
