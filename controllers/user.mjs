import { v4 as uuidv4 } from 'uuid'; 
import User from "../models/user.mjs"; // Note the .js file extension
import { setUser } from '../service/auth.mjs';
async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    // Optionally, you can send a success message or redirect to a profile page
    return res.redirect("/");
  } catch (error) {
    // Handle any errors that occur during user creation, such as duplicate email
    console.error(error);
    return res.status(500).render("signup", { error: "Failed to create the user" });
  }
}

async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).render("login", {
      error: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).render("login", {
        error: "Invalid Username or Password",
      });
    }

    // Optionally, you can set up a session or JWT to keep the user logged in
    const sessionId=uuidv4();
    setUser(sessionId,user);
    res.cookie("uid",sessionId);
    return res.redirect("/");
  } catch (error) {
    // Handle any errors that occur during user lookup
    console.error(error);
    return res.status(500).render("login", { error: "Login failed" });
  }
}

export {handleUserSignup,handleUserLogin };