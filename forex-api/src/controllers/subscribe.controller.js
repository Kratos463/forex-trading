const Subscribe = require("../models/subscribe");


const subscribe = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the email is already subscribed
        const existingUser = await Subscribe.findOne({ email });

        if (existingUser) {
            // If user is already subscribed, send a respectful message
            return res.status(200).json({ message: "You are already subscribed to our launch notification!" });
        }

        // If not subscribed, create a new subscription entry
        const newUser = new Subscribe({ email });
        await newUser.save();

        // Send a success message
        res.status(201).json({ message: "Thank you for subscribing! We will notify you when we launch." });

    } catch (error) {
        // Handle errors and send a generic error message
        if (error.code === 11000) {
            // Duplicate key error (email already exists)
            res.status(400).json({ message: "This email is already subscribed." });
        } else {
            res.status(500).json({ message: "An error occurred while processing your request. Please try again later." });
        }
    }
};

module.exports = { subscribe };
