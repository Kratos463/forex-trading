const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const walletSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
        index: true
    },
    walletAddress: {
        type: String,
        required: true,
    },
    walletPrivateKey: {
        type: String,
        required: true,
    },
    balance: { type: Number, default: 0 },
    selfRoi: { type: Number, default: 0 },
    teamRoi: { type: Number, default: 0 },
    directReferral: { type: Number, default: 0 },
    totalInvestment: {
        type: Number,
        default: 0
    },
    walletQrCode: {
        type: String, 
        required: true
    },
    transactions: [{
        type: Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
    securitySettings: {
        twoFactorAuthEnabled: { type: Boolean, default: false },
    },
}, { timestamps: true });

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
