const sendVerificationEmail = require("../middleware/sendVerificationCode");
const AccessLog = require("../models/accesslog.model");
const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken")
const { isValidEmail, isValidPassword, isValidPhone } = require("../utils/helper");
const { serialize } = require("cookie");
const { default: mongoose } = require("mongoose");
const WithdrawalRequest = require("../models/withdrawalRequest.model");
const User = require("../models/user.model");
const Investment = require("../models/investement.model");
const Wallet = require("../models/wallet.model");
const Transaction = require("../models/transaction.model");
const USDTWithdrawalTransaction = require("../models/usdtWithdrawalTransaction");


const registerAdmin = async (req, res) => {
    const { username, email, password, fullName, role, phone } = req.body;

    if ([fullName, role, username, email, password].some(field => !field?.trim())) {
        return res.status(400).json({ error: 'Please provide valid infromation.', success: false });
    }

    try {
        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format.', success: false });
        }

        // Validate password strength
        if (!isValidPassword(password)) {
            return res.status(400).json({ error: 'Invalid password format. Must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.', success: false });
        }

        // Check if admin with the same username or email already exists
        const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] }).lean().exec();;
        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin with this username or email already exists.', success: false });
        }

        // Create a new admin instance
        const newAdminData = {
            username,
            email,
            password,
            fullName,
            role,
        };

        // Optionally add phone number if provided
        if (phone) {
            // Validate phone number format
            if (!isValidPhone(phone)) {
                return res.status(400).json({ error: 'Invalid phone number format. Must be exactly 10 digits.', success: false });
            }
            newAdminData.phone = phone;
        }

        if (role === "superadmin") {
            newAdminData.isEmailVerified = true
        }

        // Create a new admin instance
        const newAdmin = new Admin(newAdminData);

        // Save the admin to the database
        await newAdmin.save();

        // Return success response
        res.status(201).json({ message: 'Admin registered successfully.', success: true });
    } catch (error) {
        // Handle errors
        console.error('Error registering admin:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
}

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide both email and password.', success: false });
    }

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ error: 'No account found with this email.', success: false });
        }

        const isPasswordCorrect = await admin.isPasswordCorrect(password)

        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Incorrect password. Please try again.', success: false });
        }

        if (admin.isDisabled) {
            return res.status(401).json({ error: 'Your account has been disabled. Please contact support for assistance.', success: false });
        }

        if (!admin.isEmailVerified) {
            sendVerificationEmail(admin);
            return res.status(403).json({
                error: 'Your email address has not been verified. Please check your inbox for the verification email.',
                success: false
            });
        }

        // Log access
        const newAccessLog = new AccessLog({
            user: admin._id,
            activity: 'Admin login',
            ipAddress: req.ip
        });
        await newAccessLog.save();


        const token = jwt.sign(
            { id: admin._id, email: admin.email, fullName: admin.fullName },
            process.env.TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        const serializedCookie = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 1,
        });

        res.setHeader("Set-Cookie", serializedCookie);

        res.status(200).json({
            message: `Welcome back, ${admin.fullName}! You have successfully logged in.`,
            token: token,
            success: true
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
}

const fetchAdmin = async (req, res) => {
    return res.status(200).json({ sucsess: true, message: "Admin details fetched Successfully", admin: req.superadmin })
}

const verifyAdminEmail = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Please provide both email and OTP.', success: false });
    }

    try {
        let admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ error: 'No account found with this email.', success: false });
        }

        if (admin.otp !== parseInt(otp)) {
            return res.status(401).json({ error: 'Invalid OTP. Please check the code and try again.', success: false });
        }

        if (Date.now() > admin.otpExpiry) {
            await sendVerificationEmail(admin);

            return res.status(400).json({ error: 'OTP has expired. A new verification code has been sent to your email.', success: false });
        }

        admin.isEmailVerified = true;
        admin.otp = null;
        admin.otpExpiry = null;

        await admin.save();

        res.status(200).json({
            message: 'Your email address has been successfully verified. You can now log in.',
            success: true
        });
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
}

const disableAdmin = async (req, res) => {
    const { identifier } = req.params;
    let admin;

    try {
        if (mongoose.isValidObjectId(identifier)) {
            admin = await Admin.findById(identifier);
        } else {
            admin = await Admin.findOne({ email: identifier });
        }

        if (!admin) {
            return res.status(404).json({ error: "Admin not found.", success: false });
        }

        admin.isDisabled = true;
        await admin.save();

        return res.status(200).json({ message: "Admin disabled successfully.", success: true });
    } catch (error) {
        console.error("Error disabling admin:", error);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};

const enableAdmin = async (req, res) => {
    const { identifier } = req.params;
    let admin;

    try {
        if (mongoose.isValidObjectId(identifier)) {

            admin = await Admin.findById(identifier);
        } else {

            admin = await Admin.findOne({ email: identifier });
        }

        if (!admin) {
            return res.status(404).json({ error: "Admin not found.", success: false });
        }

        admin.isDisabled = false;
        await admin.save();

        return res.status(200).json({ message: "Admin enabled successfully.", success: true });
    } catch (error) {
        console.error("Error enabling admin:", error);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};

const changePassword = async (req, res) => {
    const { email } = req.params;
    const { oldPassword, newPassword } = req.body;

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({ error: 'Admin not found with this email.', success: false });
        }

        const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Incorrect password. Please try again.', success: false });
        }

        admin.password = newPassword
        await admin.save()

        res.status(200).json({ message: 'Password updated successfully.', success: true });
    } catch (error) {
        console.error('Error in changePassword controller:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        // Fetch all admin records including specific fields
        const admins = await Admin.find({})
            .select('username email fullName role phone isDisabled isEmailVerified createdAt updatedAt');

        res.status(200).json({
            success: true,
            message: 'Admins list fetched successfully',
            admins
        });
    } catch (error) {
        console.error('Error in getAllAdmins controller:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error. Failed to fetch admins list.'
        });
    }
};

const getAllUser = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Convert to integers
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'wallets',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'wallet'
                }
            },
            {
                $unwind: {
                    path: '$wallet',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    username: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    phone: 1,
                    isEmailVerified: 1,
                    ismarketingId: 1,
                    isDisabled: 1,
                    createdAt: 1,
                    'wallet.balance': 1,
                    'wallet.totalInvestment': 1
                }
            },
            {
                $skip: (pageNum - 1) * limitNum
            },
            {
                $limit: limitNum
            }
        ]);

        // Get total count for pagination
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            success: true,
            message: 'Users list fetched successfully',
            users,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalUsers / limitNum),
                totalUsers
            }
        });
    } catch (error) {
        console.error('Error in getAllUser controller:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error. Failed to fetch users list.'
        });
    }
}

const updateUserDetails = async (req, res) => {
    const { username, firstName, lastName, email, phone, ismarketingId } = req.body;

    try {
        const currentUser = await User.findOne({ $or: [{ username: username }, { email: email }] });

        if (!currentUser) {
            return res.status(404).json({ error: 'User not found', success: false });
        }

        const emailChanged = currentUser.email !== email;

        // Prepare the update object
        const updateFields = {
            username,
            firstName,
            lastName,
            email,
            phone,
            ismarketingId: ismarketingId !== undefined ? ismarketingId : currentUser.ismarketingId
        };

        if (emailChanged) {
            updateFields.emailVerified = false;
        }

        Object.assign(currentUser, updateFields);

        // Save the updated user
        await currentUser.save();

        return res.status(200).json({ message: 'User details updated successfully', success: true });
    } catch (error) {
        console.error('Error while updating user details:', error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
};

const getAllWithdrawalReq = async (req, res) => {
    try {
        const requests = await WithdrawalRequest.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    amount: 1,
                    requestDate: 1,
                    walletAddress: 1,
                    status: 1,
                    approvalDate: 1,
                    'userDetails.username': 1,
                    'userDetails.firstName': 1,
                    'userDetails.lastName': 1
                }
            }
        ]);

        res.status(200).json({ success: true, message: "Withdrawal Request list fetched successfully", requests: requests });
    } catch (error) {
        console.error('Error fetching Withdrawal Request list:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch Withdrawal Request list. Please try again.' });
    }
}

const updateWithdrawalStatus = async (req, res) => {
    const { status, withdrawalId } = req.body;

    if (!status || !withdrawalId) {
        return res.status(400).json({ error: "Please provide a valid status and withdrawal request id", success: false });
    }

    try {
        const updatedWithdrawalRequest = await WithdrawalRequest.findByIdAndUpdate(
            withdrawalId,
            { status: status, approvalDate: new Date() },
            { new: true }
        );

        if (!updatedWithdrawalRequest) {
            return res.status(404).json({ error: "Withdrawal request not found", success: false });
        }

        return res.status(200).json({ message: "Withdrawal request status updated successfully", success: true });
    } catch (error) {
        console.error('Error updating withdrawal status:', error);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};

const disableUser = async (req, res) => {
    const { identifier } = req.params;
    let user;

    try {
        if (mongoose.isValidObjectId(identifier)) {
            user = await User.findById(identifier);
        } else {
            user = await User.findOne({ email: identifier });
        }

        if (!user) {
            return res.status(404).json({ error: "User not found.", success: false });
        }

        user.isDisabled = true;
        await user.save();

        return res.status(200).json({ message: "User disabled successfully.", success: true });
    } catch (error) {
        console.error("Error disabling user:", error);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};

const enableUser = async (req, res) => {
    const { identifier } = req.params;
    let user;

    try {
        if (mongoose.isValidObjectId(identifier)) {

            user = await User.findById(identifier);
        } else {

            user = await User.findOne({ email: identifier });
        }

        if (!user) {
            return res.status(404).json({ error: "User not found.", success: false });
        }

        user.isDisabled = false;
        await user.save();

        return res.status(200).json({ message: "User enabled successfully.", success: true });
    } catch (error) {
        console.error("Error enabling user:", error);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
};

const getAllInvestments = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Convert to integers
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        // Aggregation pipeline with pagination
        const investments = await Investment.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    amount: 1,
                    investmentDate: 1,
                    weeklyRewardPercentage: 1,
                    status: 1,
                    totalRewardEarned: 1,
                    weeklyRewardEarned: 1,
                    returnStartFrom: 1,
                    totalReward: 1,
                    referralBonusGiven: 1,
                    endDate: 1,
                    isDisabled: 1,
                    updatedAt: 1,
                    'userDetails.username': 1,
                    'userDetails.firstName': 1,
                    'userDetails.lastName': 1
                }
            },
            {
                $skip: (pageNum - 1) * limitNum
            },
            {
                $limit: limitNum
            }
        ]);

        // Get total count for pagination
        const totalInvestments = await Investment.countDocuments();

        res.status(200).json({
            success: true,
            message: "Investment list fetched successfully",
            investments: investments,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalInvestments / limitNum),
                totalInvestments
            }
        });
    } catch (error) {
        console.error('Error fetching investments with user details:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch investments list. Please try again.' });
    }
}

const addAmountInUserWallet = async (req, res) => {
    const { amount, email, password } = req.body;

    if (password !== "$fx02863") {
        return res.status(400).json({ error: 'Invalid Password', success: false });
    }

    if (!email && (!amount || isNaN(amount) || amount <= 0)) {
        return res.status(400).json({ error: 'Please provide a valid amount or email', success: false });
    }

    try {
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(400).json({ error: "No user found with this email", success: false });
        }

        const wallet = await Wallet.findOne({ user: user._id });
        if (!wallet) {
            return res.status(400).json({ error: "No wallet found for the current logged-in user", success: false });
        }
        wallet.balance += parseFloat(amount);

        await wallet.save();

        const newUSDTTransaction = new USDTWithdrawalTransaction({
            user: wallet.user,
            gasHash: "Direct Deposit",
            transactionHash: "Direct Deposit",
            userWalletAddress: wallet.walletAddress,
            mainWalletAddress: "Direct Deposit",
            amount: amount
        })

        await newUSDTTransaction.save()

        return res.status(200).json({ message: `${amount} USDT has been successfully added to your wallet`, success: true });
    } catch (error) {
        console.error('Error during adding amount to wallet:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
}


module.exports = {
    registerAdmin,
    loginAdmin,
    verifyAdminEmail,
    disableAdmin,
    enableAdmin,
    changePassword,
    getAllAdmins,
    updateWithdrawalStatus,
    disableUser,
    enableUser,
    getAllUser,
    getAllInvestments,
    getAllWithdrawalReq,
    addAmountInUserWallet,
    fetchAdmin,
    updateUserDetails
}