const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
require("dotenv").config();
const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.use(express.json());
app.listen(4000);

app.use(
    session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);


mongoose
    .connect(process.env.MONGO_KEY)
    .then((res) => {
        console.log("connection good");
    })
    .catch((e) => {
        console.log(e);
    });

/*
app.get('/',(req, res, next)=> {
    req.session
/// testinng
})*/



const router = require("./routes/main");
app.use("/", router);
