import express from "express";
import URL from "../models/url.mjs";
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        if(!req.user) return res.redirect('/login')
        const allurls = await URL.find({createdBy:req.user._id});
        return res.render("home", {
            urls: allurls,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
  router.get("/signup",(req,res)=>{
    return res.render("signup");
  });
  router.get("/login",(req,res)=>{
    return res.render("login");
  });
export { router };