const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
  withdrawalApprovalProcess: { type: String, enum: ['manual', 'auto'], default: 'manual' },
  investmentReturnRate: {
    weeklyReturnRate: {
      type: Number,
      required: true
    },
    WeeklyMaximumReturnRate: {
      type: Number,
      required: true
    }
  },
  directReferralReturnRate: {
    type: Number,
    default: 10,
    required: true,
  },
  referralCommissionRates: {
    level1: { type: Number, default: 20 },
    level2: { type: Number, default: 10 },
    level3: { type: Number, default: 5 },
    level4: { type: Number, default: 3 },
    level5: { type: Number, default: 3 },
    level6: { type: Number, default: 2 },
    level7: { type: Number, default: 2 },
    level8: { type: Number, default: 1 },
    level9: { type: Number, default: 1 },
    level10: { type: Number, default: 0.5 },
    level11: { type: Number, default: 0.5 },
    level12: { type: Number, default: 0.5 },
    level13: { type: Number, default: 0.5 },
    level14: { type: Number, default: 0.5 },
    level15: { type: Number, default: 0.5 },

  },
}, { timestamps: true });

const Settings = mongoose.model('Setting', settingsSchema);

module.exports = Settings;
