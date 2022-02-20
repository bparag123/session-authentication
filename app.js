import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.js';
import { getLogin, login, logout, signUp } from './controllers/user.js'
import auth from './middlewares/auth.js'
import MongoStore from 'connect-mongo'
import csurf from 'csurf';
import dotenv from "dotenv"
dotenv.config()
const PORT = process.env.PORT || 4000
const app = express();

const csrfProtection = csurf({
    cookie: true
})

// Connection Of Database
try {
    await mongoose.connect(process.env.DB_URL)
    console.log("Connected to Database");
} catch (error) {
    console.log("Database Connection Error");
}

app.use(express.json())

//Cookie parser to get cookie from request object
app.use(cookieParser())

app.post("/signup",signUp)

// This setup is for session
app.use(session({
    // This is Secret to generate Token
    secret: process.env.SESSION_SECRET,
    // This is false because i only want to save the modified session
    saveUninitialized: false,
    // This will resave the session.cookie value every time
    resave: true,
    cookie: { maxAge: 1000 * 60 },
    store: MongoStore.create({
        mongoUrl: "mongodb://localhost:27017/session-user",
        // This will clean the session store after every 10 minute
        autoRemove: 'interval',
        autoRemoveInterval: 10
    })
}))
app.post("/logout", auth, csrfProtection, logout)

app.get("/private", auth, (req, res) => {
    res.send(`Hello ${req.session.user.username}! You are Accessing Protected end-point`)
})
app.get("/login", csrfProtection, getLogin)
app.post("/login", csrfProtection,login)

//This is error handling middleware
app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})