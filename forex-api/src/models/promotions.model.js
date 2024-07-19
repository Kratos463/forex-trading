const { Schema, model } = require('mongoose')

const promotionSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true,
        trim: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalSelfInvestment: {
        type: Number,
        default: 0
    },
    totalTeamInvestment: {
        type: Number,
        default: 0
    },
    totalDirectReferral: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "expire"]
    },
    totalAchivers: {
        type: Number,
        default: 0
    }

}, { timestamps: true })

const Promotion = model("Promotion", promotionSchema)

module.exports = Promotion