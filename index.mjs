import express from "express";
import { connectToMongoDB } from "./connect.mjs"; // Note the .mjs file extension
import { router as urlRoute } from "./routes/url.mjs"; // Import named export 'router'
import URL from "./models/url.mjs";

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() => {
  console.log("Mongodb connected");
});
app.use(express.json());
app.use("/url", urlRoute);
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory:{
          timestamp:Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL)
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT} `));
