const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const referralSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  referrer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, {timestamps: true});

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
