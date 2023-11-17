import express from "express";
import path from "path";
import URL from "./models/url.mjs";
import cookieParser from "cookie-parser";
import { restrictToLoggedinUserOnly ,checkAuth} from "./middlewares/auth.mjs";


import { connectToMongoDB } from "./connect.mjs";
import { router as urlRoute } from "./routes/url.mjs";
import { router as staticRouter } from "./routes/staticRouter.mjs";
import { router as userRoute } from "./routes/user.mjs";

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() => {
  console.log("Mongodb connected");
});
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/url",restrictToLoggedinUserOnly, urlRoute);
app.use("/",checkAuth, staticRouter);
app.use("/user", userRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;

  try {
    const entry = await URL.findOneAndUpdate(
      {
        shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );

    if (entry) {
      res.redirect(entry.redirectURL);
    } else {
      // Handle the case where the document is not found
      res.status(404).send("URL not found");
    }
  } catch (error) {
    // Handle any other errors that may occur during the database operation
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT} `));
