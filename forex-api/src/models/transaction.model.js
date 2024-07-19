const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal','refund'],
        required: true
    },
    wallet: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    commissionType: {
        type: String,
        enum: ["direct_referral", "team_roi", "self_roi"],
        default: null,
    },
    amount: { type: Number, required: true },
    transactionDate: { type: Date, default: Date.now },
    details: { type: String },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
