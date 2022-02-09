import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorHandler.js';
import { login, signUp } from './controllers/user.js'
import auth from './middlewares/auth.js'
import MongoStore from 'connect-mongo'
const app = express();

try {
    await mongoose.connect("mongodb://localhost:27017/session-user")
    console.log("Connected to Database");
} catch (error) {
    console.log("Database Connection Error");
}

app.use(express.json())

app.use(cookieParser())

app.post("/signup", signUp)

// This setup is for session
app.use(session({
    // This is Secret to generate Token
    secret: 'Simform_Secret',
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
app.get("/logout", auth, (req, res) => {

    req.session.destroy()
    res.json({
        message: "logout successfull"
    })
})
app.get("/private", auth, (req, res) => {
    res.send(`Hello ${req.session.user.username}! You are Accessing Protected end-point`)
})
app.post("/login", login)



app.use(errorHandler)
app.listen(3000, () => {
    console.log("server is running");
})