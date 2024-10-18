const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("Database Connected!!");
    } catch (error) {
        console.log("Failed to connect database ", error);
        process.exit(1);
    }
}

module.exports = connectDB;