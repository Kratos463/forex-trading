const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userWalletAddress: {
        type: String, 
        required: true
    },
    mainWalletAddress: {
        type: String,
        required: true
    },
    amount: { 
        type: Number, 
        required: true 
    },
    gasHash: {
        type: String,
        required: true
    },
    transactionHash: {
        type: String,
        required: true
    }
}, { timestamps: true });

const USDTWithdrawalTransaction = mongoose.model('USDTWithdrawalTransaction', transactionSchema);

module.exports = USDTWithdrawalTransaction;
