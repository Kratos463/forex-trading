const { Schema, model } = require("mongoose");

const subscribeSchema = new Schema({
    email: {
        type: String,
        required: true,
        index: true,
        trim: true,
        unique: true,
    }
}, { timestamps: true });

const Subscribe = model('Subscribe', subscribeSchema);

module.exports = Subscribe;
