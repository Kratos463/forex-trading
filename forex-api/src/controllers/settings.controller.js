const Settings = require("../models/settings.model");

const addOrUpdateSettings = async (req, res) => {
    const {
        withdrawalApprovalProcess,
        weeklyReturnRate,
        WeeklyMaximumReturnRate,
        directReferralReturnRate,
        level1, level2, level3, level4, level5,
        level6, level7, level8, level9, level10,
        level11, level12, level13, level14, level15,
    } = req.body;

    try {
        const settings = await Settings.findOne();

        if (settings) {
            // Update existing settings
            settings.withdrawalApprovalProcess = withdrawalApprovalProcess || settings.withdrawalApprovalProcess;
            settings.directReferralReturnRate = directReferralReturnRate || settings.directReferralReturnRate;
            settings.investmentReturnRate.weeklyReturnRate = weeklyReturnRate || settings.investmentReturnRate.weeklyReturnRate;
            settings.investmentReturnRate.WeeklyMaximumReturnRate = WeeklyMaximumReturnRate || settings.investmentReturnRate.WeeklyMaximumReturnRate;
            settings.referralCommissionRates.level1 = level1 || settings.referralCommissionRates.level1;
            settings.referralCommissionRates.level2 = level2 || settings.referralCommissionRates.level2;
            settings.referralCommissionRates.level3 = level3 || settings.referralCommissionRates.level3;
            settings.referralCommissionRates.level4 = level4 || settings.referralCommissionRates.level4;
            settings.referralCommissionRates.level5 = level5 || settings.referralCommissionRates.level5;
            settings.referralCommissionRates.level6 = level6 || settings.referralCommissionRates.level6;
            settings.referralCommissionRates.level7 = level7 || settings.referralCommissionRates.level7;
            settings.referralCommissionRates.level8 = level8 || settings.referralCommissionRates.level8;
            settings.referralCommissionRates.level9 = level9 || settings.referralCommissionRates.level9;
            settings.referralCommissionRates.level10 = level10 || settings.referralCommissionRates.level10;
            settings.referralCommissionRates.level11 = level11 || settings.referralCommissionRates.level11;
            settings.referralCommissionRates.level12 = level12 || settings.referralCommissionRates.level12;
            settings.referralCommissionRates.level13 = level13 || settings.referralCommissionRates.level13;
            settings.referralCommissionRates.level14 = level14 || settings.referralCommissionRates.level14;
            settings.referralCommissionRates.level15 = level15 || settings.referralCommissionRates.level15;

            await settings.save();
            return res.status(200).json({ success: true, message: 'Settings updated successfully', settings: settings });
        } else {
            // Create new settings
            const newSettings = new Settings({
                withdrawalApprovalProcess,
                investmentReturnRate: {
                    weeklyReturnRate,
                    WeeklyMaximumReturnRate
                },
                referralCommissionRates: {
                    level1, level2, level3, level4, level5,
                    level6, level7, level8, level9, level10,
                    level11, level12, level13, level14, level15
                }
            });

            await newSettings.save();
            return res.status(201).json({ success: true, message: 'Settings created successfully', settings: newSettings });
        }
    } catch (error) {
        console.error('Error adding or updating settings:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne()
        return res.status(201).json({ success: true, message: 'Settings fetched successfully', settings: settings });
    }
    catch (error) {
        console.error('Error while fetched settings:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

const updateWeeklyReturnRate = async (req, res) => {
    const { weeklyReturnRate } = req.body;

    try {
        const settings = await Settings.findOne();

        if (!settings) {
            return res.status(404).json({ success: false, message: 'Settings not found' });
        }

        settings.investmentReturnRate.weeklyReturnRate = weeklyReturnRate;

        await settings.save();
        return res.status(200).json({ success: true, message: 'Weekly return rate updated successfully', settings: settings });
    } catch (error) {
        console.error('Error updating weekly return rate:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

const updateDirectReferralReturnRate = async (req, res) => {
    const { directReferralReturnRate } = req.body;

    try {
        const settings = await Settings.findOne();

        if (!settings) {
            return res.status(404).json({ success: false, message: 'Settings not found' });
        }

        settings.directReferralReturnRate = directReferralReturnRate;

        await settings.save();
        return res.status(200).json({ success: true, message: 'Direct referral return rate updated successfully', settings: settings });
    } catch (error) {
        console.error('Error updating direct referral return rate:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

const updateReferralCommissionRates = async (req, res) => {
    const {
        level1, level2, level3, level4, level5,
        level6, level7, level8, level9, level10,
        level11, level12, level13, level14, level15
    } = req.body;

    try {
        const settings = await Settings.findOne();

        if (!settings) {
            return res.status(404).json({ success: false, message: 'Settings not found' });
        }

        settings.referralCommissionRates = {
            level1: level1 || settings.referralCommissionRates.level1,
            level2: level2 || settings.referralCommissionRates.level2,
            level3: level3 || settings.referralCommissionRates.level3,
            level4: level4 || settings.referralCommissionRates.level4,
            level5: level5 || settings.referralCommissionRates.level5,
            level6: level6 || settings.referralCommissionRates.level6,
            level7: level7 || settings.referralCommissionRates.level7,
            level8: level8 || settings.referralCommissionRates.level8,
            level9: level9 || settings.referralCommissionRates.level9,
            level10: level10 || settings.referralCommissionRates.level10,
            level11: level11 || settings.referralCommissionRates.level11,
            level12: level12 || settings.referralCommissionRates.level12,
            level13: level13 || settings.referralCommissionRates.level13,
            level14: level14 || settings.referralCommissionRates.level14,
            level15: level15 || settings.referralCommissionRates.level15,
        };

        await settings.save();
        return res.status(200).json({ success: true, message: 'Referral commission rates updated successfully', settings: settings });
    } catch (error) {
        console.error('Error updating referral commission rates:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
}



module.exports = { addOrUpdateSettings, getSettings, updateWeeklyReturnRate, updateDirectReferralReturnRate, updateReferralCommissionRates }