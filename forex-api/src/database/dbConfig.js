const mongoose = require("mongoose")
const { DB_NAME } = require("../utils/constants");

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI
        const connectionInstance = await mongoose.connect(`${mongoURI}/${DB_NAME}`);
        console.log("Server Connected to MongoDB...");
    } catch (error) {
        console.error("Error while connecting to MongoDB:", error);
        process.exit(1); // Exit with failure
    }
};

module.exports = { connectDB };
