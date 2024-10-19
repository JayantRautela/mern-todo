const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

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

const userRouter = require("./routes/user.routes.js");


app.use("/user", userRouter);