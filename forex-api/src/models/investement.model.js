const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const investmentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  investmentDate: { type: Date, default: Date.now },
  weeklyRewardPercentage: { type: Number, required: true },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  returns: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
  totalRewardEarned: { type: Number, default: 0 },
  weeklyRewardEarned: { type: Number, default: 0 },
  returnStartFrom: { type: Date, required: true },
  totalReward: { type: Number, required: true },
  referralBonusGiven: { type: Boolean, default: false },
  endDate: { type: Date },
  isDisabled: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Investment = mongoose.model('Investment', investmentSchema);

module.exports = Investment;
