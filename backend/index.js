const express = require("express");
const connectDB = require("./config/db.js");

require("dotenv").config();

const app = express();

const port = process.env.PORT;

connectDB()
.then( () => {
    app.listen(port, () => {
        console.log(`Server started at port : ${port}`);
    })
})
.catch( (err) => {
    console.log("connection failed ", err);
})