const dotenv = require("dotenv")
const { app } = require("./src/app.js")
const { connectDB } = require('./src/database/dbConfig.js')

dotenv.config()

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 9001, () => {
            console.log("Server is running at port", process.env.PORT)
        })
        // Handle server error event
        app.on('error', (err) => {
            console.error('Server error:', err);
        });

        // Handle server close event
        app.on('close', () => {
            console.log('Server closed');
        });
    })
    .catch((err) => {
        console.log("Mongo db connection failed", err)
    })