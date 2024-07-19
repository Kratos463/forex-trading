const cron = require('node-cron');
const Investment = require("../models/investement.model");
const Settings = require("../models/settings.model");
const Transaction = require("../models/transaction.model");
const User = require("../models/user.model");
const Wallet = require("../models/wallet.model");

const createInvestment = async (req, res) => {
    const { amount } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount < 100) {
        return res.status(400).json({ error: 'Please provide a valid amount of at least 100 USDT', success: false });
    }

    try {
        const settings = await Settings.findOne();

        const wallet = await Wallet.findOne({ user: req.user._id });
        if (!wallet) {
            return res.status(400).json({ error: "No wallet found for the current logged-in user", success: false });
        }

        // Deduct from wallet balance
        if (wallet.balance < amount) {
            return res.status(400).json({ error: "Insufficient balance to make investment", success: false });
        }
        wallet.balance -= amount;
        wallet.totalInvestment += amount;
        await wallet.save();

        // Calculate investment details
        const weeklyRewardPercentage = settings.investmentReturnRate.weeklyReturnRate;
        const totalReward = amount * 2;
        const weeklyReturn = amount * (weeklyRewardPercentage / 100)

        // Calculate return start and end dates
        const returnStartFrom = new Date();
        returnStartFrom.setDate(returnStartFrom.getDate() + (8 - returnStartFrom.getDay()) % 7); // Start from upcoming Monday

        const totalReturnWeeks = Math.ceil(totalReward / weeklyReturn);

        const endDate = new Date(returnStartFrom);
        endDate.setDate(returnStartFrom.getDate() + 7 * totalReturnWeeks); // End date after totalReturnWeeks weeks

        // Create new investment record
        const investment = new Investment({
            user: req.user._id,
            amount: amount,
            status: "active",
            weeklyRewardPercentage: weeklyRewardPercentage,
            weeklyRewardEarned: weeklyReturn,
            totalReward: totalReward,
            isDisabled: false,
            totalRewardEarned: 0,
            endDate: endDate,
            returnStartFrom: returnStartFrom,
            referralBonusGiven: false,
        });

        // Save investment record
        await investment.save();

        // Create transaction record
        const transaction = new Transaction({
            user: req.user._id,
            amount: amount,
            type: "withdrawal",
            wallet: wallet._id,
            details: `${amount} USDT withdrawal from wallet to make an investment, investment id ${investment._id}`
        });

        await transaction.save();

        return res.status(200).json({ success: true, message: `Investment of ${amount} USDT created successfully`, investment });
    } catch (error) {
        console.error('Error creating investment:', error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
}

// get the investment of the users
const getInvestment = async (req, res) => {
    try {
        const userId = req.user._id;
        const investments = await Investment.find({ user: userId });

        if (!investments || investments.length === 0) {
            return res.status(400).json({ error: "No investments found for the current logged-in user", success: false });
        }

        return res.status(200).json({ message: "Investments fetched successfully", success: true, investments: investments });

    } catch (error) {
        console.error('Error while fetching investments:', error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
}


// return the weekly roi of the investment
const processInvestments = async () => {
    try {
        const today = new Date();

        // Find all active investments where return start date is before or equal to today
        const investments = await Investment.find({
            status: 'active',
            isDisabled: false,
            returnStartFrom: { $lte: today },
            endDate: { $gt: today },
        });

        for (const investment of investments) {
            const userId = investment.user;
            const weeklyReturn = investment.amount * (investment.weeklyRewardPercentage / 100);

            // Update total reward earned and check if investment should be completed
            investment.totalRewardEarned += weeklyReturn;

            if (investment.totalRewardEarned >= investment.totalReward) {
                investment.status = 'completed';
                investment.totalRewardEarned = investment.totalReward; // Ensure it doesn't exceed total reward
            }

            await investment.save();

            // Update the user's wallet
            const wallet = await Wallet.findOne({ user: userId });
            if (wallet) {
                wallet.selfRoi += weeklyReturn;
                wallet.balance += weeklyReturn;

                await wallet.save();

                const transaction = new Transaction({
                    user: userId,
                    amount: weeklyReturn,
                    type: 'deposit',
                    commissionType: 'self_roi',
                    wallet: wallet._id,
                    details: `Weekly return of ${weeklyReturn} USDT for investment ID ${investment._id}`
                });

                await transaction.save();
            }
        }
    } catch (error) {
        console.error('Error processing investments:', error);
    }
};

// return the direct referral bonus of the investment
const processDirectReferralBonuses = async () => {
    try {
        const settings = await Settings.findOne();
        const directReferralBonusRate = settings.directReferralReturnRate;

        const investments = await Investment.find({
            status: "active",
            isDisabled: false,
            referralBonusGiven: { $ne: true }
        });

        for (let investment of investments) {
            const user = await User.findById(investment.user);
            if (user.referredBy) {
                const referrerWallet = await Wallet.findOne({ user: user.referredBy });

                if (!referrerWallet) {
                    console.error(`No wallet found for referrer ${user.referredBy}`);
                    continue;
                }

                const directReferralBonus = investment.amount * (directReferralBonusRate / 100);

                referrerWallet.directReferral += directReferralBonus;
                referrerWallet.balance += directReferralBonus;
                await referrerWallet.save();

                // Log the transaction
                const transaction = new Transaction({
                    user: user.referredBy,
                    amount: directReferralBonus,
                    type: "deposit",
                    commissionType: "direct_referral",
                    wallet: referrerWallet._id,
                    details: `Direct referral bonus of ${directReferralBonus} USDT for investment ${investment._id}`,
                });
                await transaction.save();

                // Mark referral bonus as given
                investment.referralBonusGiven = true;
                await investment.save();
            }
        }
    } catch (error) {
        console.error('Error processing referral bonuses:', error);
    }
};


// return the team bonus
const processTeamRoiBonuses = async () => {
    try {
      const settings = await Settings.findOne();
      const today = new Date();

      const investments = await Investment.find({
        status: "active",
        isDisabled: false,
        startDate: { $lte: today },
        endDate: { $gte: today }
      });
  
      for (let investment of investments) {
        const user = await User.findById(investment.user);
        let currentReferrerId = user.referredBy;
        let level = 1;
  
        while (currentReferrerId && level <= 15) {
          const referrer = await User.findById(currentReferrerId);
          const referrerWallet = await Wallet.findOne({ user: currentReferrerId });
  
          if (!referrerWallet) {
            console.error(`No wallet found for referrer ${currentReferrerId}`);
            break;
          }
  
          const referralCommissionRate = settings[`level${level}`] || 0; // Get commission rate for the current level
          const referralBonus = investment.weeklyRewardEarned * (referralCommissionRate / 100);
  
          referrerWallet.balance += referralBonus;
          await referrerWallet.save();
  
          // Log the transaction
          const transaction = new Transaction({
            user: currentReferrerId,
            amount: referralBonus,
            type: "deposit",
            commissionType: "team_referral",
            wallet: referrerWallet._id,
            details: `Team referral bonus of ${referralBonus} USDT for investment ${investment._id}`,
          });
          await transaction.save();
  
          // Move to the next level referrer
          currentReferrerId = referrer.referredBy;
          level++;
        }
  
        await investment.save();
      }
    } catch (error) {
      console.error('Error processing referral bonuses:', error);
    }
  };
  

const runScheduledTasks = async () => {
    try {
        await processInvestments();
        await processDirectReferralBonuses();
        await processTeamRoiBonuses()
    } catch (error) {
        console.error('Error running scheduled tasks:', error);
    }
};


cron.schedule('0 0 * * 1', async () => {
    await runScheduledTasks();
});

const triggerScheduledTasks = async (req, res) => {
    try {
        await runScheduledTasks();
        return res.status(200).json({ message: 'Scheduled tasks triggered successfully' });
    } catch (error) {
        console.error('Error triggering scheduled tasks:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createInvestment,
    getInvestment,
    triggerScheduledTasks
}