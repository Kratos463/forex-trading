const sendVerificationEmail = require("../middleware/sendVerificationCode");
const User = require("../models/user.model");
const { isValidEmail, isValidPassword } = require("../utils/helper");
const { serialize } = require("cookie");
const jwt = require("jsonwebtoken");
const Wallet = require("../models/wallet.model");
const WithdrawalRequest = require("../models/withdrawalRequest.model");
const { generatebipWallet, generateQRCode } = require("../utils/generateWallet");
const createAccessLog = require("../utils/accessLog");
const mongoose = require('mongoose');
const sendEmail = require("../middleware/sendVerificationCode");
const { generateStrongPassword } = require("../utils/generatePassword");

const registerUser = async (req, res) => {
    const { email, password, firstName, lastName, phone, referredBy, terms, country, ismarketingId } = req.body;

    if ([email, password, firstName, country].some(field => !field?.trim())) {
        return res.status(400).json({ error: 'Please provide valid information for all required fields.', success: false });
    }

    try {
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format.', success: false });
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({ error: 'Invalid password format. Must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.', success: false });
        }

        const existingUser = await User.findOne({ email }).lean().exec();
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.', success: false });
        }

        let referredUser = null;
        if (referredBy) {
            referredUser = await User.findOne({ username: referredBy }).lean().exec();
            if (!referredUser) {
                return res.status(400).json({ error: 'Referred user does not exist.', success: false });
            }
        }

        const generateUniqueUsername = async () => {
            let username;
            let existingUsername;
            do {
                username = Math.floor(10000000 + Math.random() * 90000000).toString();
                existingUsername = await User.findOne({ username }).lean().exec();
            } while (existingUsername);
            return username;
        };

        const username = await generateUniqueUsername();

        const userCount = await User.countDocuments();

        const pw = await generateStrongPassword()

        const wallet = await generatebipWallet(pw, userCount);

        const qrCode = await generateQRCode(wallet.address);

        const profileQr = await generateQRCode(username)

        const newUser = new User({
            username,
            email,
            password,
            firstName,
            lastName: lastName?.trim() || '',
            referralId: username,
            referredBy: referredUser?._id || null,
            phone: phone?.trim() || '',
            tc: terms,
            country: country,
            profileQr: profileQr,
            ismarketingId: ismarketingId != null ? ismarketingId : false
        });

        await newUser.save();

        const newWallet = new Wallet({
            user: newUser._id,
            walletAddress: wallet.address,
            walletPrivateKey: wallet.privateKey,
            walletQrCode: qrCode
        });

        await newWallet.save();

        res.status(201).json({ message: 'User registered successfully.', success: true });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};

const loginUser = async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ error: 'Please provide both identifier and password.', success: false });
    }

    try {
        const user = await User.findByEmailOrUsername(identifier);

        if (!user) {
            return res.status(404).json({ error: 'No account found with this email.', success: false });
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password)

        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Incorrect password. Please try again.', success: false });
        }

        if (user.isDisabled) {
            return res.status(401).json({ error: 'Your account has been disabled. Please contact support for assistance.', success: false });
        }

        // Log access
        await createAccessLog(user._id, `User ${user.email} logged into their account`, req);

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        const serializedCookie = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        const wallet = await Wallet.findOne({ user: user._id })

        if (!wallet) {
            const newWallet = new Wallet({ user: user._id })
            await newWallet.save()
        }

        res.setHeader("Set-Cookie", serializedCookie);

        res.status(200).json({
            message: `Welcome back, ${user.firstName}! You have successfully logged in.`,
            token: token,
            success: true
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};

const fetchCurrentUser = async (req, res) => {
    return res.status(200).json({ sucsess: true, message: "User details fetched Successfully", user: req.user })
};

const sendVerificationLink = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found', success: false });
        }

        await sendVerificationEmail(user);
        return res.status(200).json({ message: 'Verification email sent successfully', success: true });
    } catch (error) {
        console.error('Error sending verification link:', error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
};

const verifyToken = async (req, res) => {
    const { token } = req.params;

    try {
        // Find the user with the provided token
        const user = await User.findOne({
            otp: token
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid token', success: false });
        }

        // Check if the token is expired
        if (user.otpExpiry < Date.now()) {
            // Token is expired; send a new verification email
            await sendVerificationEmail(user);
            return res.status(400).json({ error: 'Token expired. A new verification email has been sent.', success: false });
        }

        // Token is valid
        user.isEmailVerified = true; // Mark user as verified
        user.otp = undefined; // Clear the token
        user.otpExpiry = undefined; // Clear the expiry
        await user.save();

        return res.status(200).json({ message: 'Email verified successfully', success: true });
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
};

const updateUserDetails = async (req, res) => {
    const { username, firstName, lastName, email, phone } = req.body;
    try {
        const userId = req.user._id;

        // Find the current user details
        const currentUser = await User.findById(userId);

        // Check if the email has changed
        const emailChanged = currentUser.email !== email;

        // Prepare the update object
        const updateFields = {
            username,
            firstName,
            lastName,
            email,
            phone
        };

        if (emailChanged) {
            updateFields.emailVerified = false;
        }

        // Update the user
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true }
        );

        user.save()

        return res.status(200).json({ message: 'User details updated successfully', success: true });
    } catch (error) {
        console.error('Error while update user details:', error);
        return res.status(500).json({ error: 'Internal server error', success: false });
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    try {
        const user = await User.findById(req.user._id)
        const validPassword = user.isPasswordCorrect(oldPassword)

        if (!validPassword) {
            return res.status(400).json({ error: "Password not correct", success: false })
        }

        user.password = newPassword
        await user.save()

        return res.status(200).json({ message: "Password chnaged successfully", success: true })

    } catch (error) {
        console.error('Error while changing user password:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};

const directReferrals = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const page = parseInt(req.query.page) || 1; // Current page, default to 1
        const limit = parseInt(req.query.limit) || 10; // Items per page, default to 10

        // Fetch direct referrals of the current user with totalInvestment
        const directReferrals = await User.aggregate([
            { $match: { referredBy: userId } },
            {
                $lookup: {
                    from: 'wallets',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'wallet'
                }
            },
            { $unwind: '$wallet' },
            {
                $project: {
                    username: 1,
                    createdAt: 1,
                    totalInvestment: '$wallet.totalInvestment'
                }
            },
            { $skip: (page - 1) * limit },
            { $limit: limit }
        ]);

        // Function to recursively find referral chain up to 15 levels deep
        const findReferralChain = async (userIds, chain = [], level = 1) => {
            if (level > 15 || userIds.length === 0) return chain;

            const referrals = await User.aggregate([
                { $match: { referredBy: { $in: userIds } } },
                {
                    $lookup: {
                        from: 'wallets',
                        localField: '_id',
                        foreignField: 'user',
                        as: 'wallet'
                    }
                },
                { $unwind: '$wallet' },
                {
                    $project: {
                        username: 1,
                        createdAt: 1,
                        referredBy: 1,
                        'wallet.totalInvestment': 1
                    }
                }
            ]);

            referrals.forEach(referral => {
                chain.push({
                    level,
                    username: referral.username,
                    createdAt: referral.createdAt,
                    referredBy: referral.referredBy,
                    totalInvestment: referral.wallet.totalInvestment
                });
            });

            const nextLevelUserIds = referrals.map(referral => referral._id);
            return findReferralChain(nextLevelUserIds, chain, level + 1);
        };

        // Fetch the referral chain up to 15 levels deep
        const referralChain = await findReferralChain([userId], [], 1);

        // Apply pagination to the referral chain
        const paginatedChain = referralChain.slice((page - 1) * limit, page * limit);

        // Calculate the total number of pages for the referral chain
        const totalChainPages = Math.ceil(referralChain.length / limit);

        // Calculate the total number of pages for direct referrals
        const totalDirectReferrals = await User.countDocuments({ referredBy: userId });
        const totalDirectReferralPages = Math.ceil(totalDirectReferrals / limit);

        res.status(200).json({
            message: 'Direct referrals and referral chain fetched successfully.',
            success: true,
            directReferrals,
            referralChain: paginatedChain,
            currentPage: page,
            totalPages: Math.max(totalDirectReferralPages, totalChainPages) // Return the higher page count
        });
    } catch (error) {
        console.error('Error fetching referrals:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};

const withdrawalRequest = async (req, res) => {
    const { walletAddress, amount } = req.body;

    if (!walletAddress || !amount || isNaN(amount) || amount < 50) {
        return res.status(400).json({ error: 'Please provide a valid wallet address and amount greater than 50 USDT', success: false });
    }

    try {
        const userId = req.user._id;
        const wallet = await Wallet.findOne({ user: userId });

        if (!wallet) {
            return res.status(400).json({ error: 'Wallet not found for current logged-in user.', success: false });
        }

        if (wallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance.', success: false });
        }

        // Check if the user has sent a withdrawal request in the last week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const lastWithdrawalRequest = await WithdrawalRequest.findOne({
            user: userId,
            requestDate: { $gte: oneWeekAgo }
        });

        if (lastWithdrawalRequest) {
            return res.status(400).json({ error: 'You can only request a withdrawal once per week.', success: false });
        }

        // Generate a four-digit code
        const code = Math.floor(1000 + Math.random() * 9000);

        const newWithdrawalRequest = new WithdrawalRequest({
            user: userId,
            amount: amount,
            walletAddress: walletAddress,
            status: 'pending',
            code: code
        });

        await newWithdrawalRequest.save();

        // Send email with the verification code
        const emailContent = `
            <p>Your withdrawal request has been created. Please use the following code to verify your request:</p>
            <p><strong>${code}</strong></p>
        `;

        await sendEmail({
            user: req.user,
            subject: 'Withdrawal Verification Code',
            htmlContent: emailContent
        });

        res.status(200).json({ message: 'Withdrawal request created successfully. A verification code has been sent to your email.', success: true });
    } catch (error) {
        console.error('Error during withdrawal request:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};

const verifyCode = async (req, res) => {
    const { requestId, code } = req.body;

    if (!requestId || !code) {
        return res.status(400).json({ error: 'Request ID and code are required.', success: false });
    }

    try {
        const withdrawalRequest = await WithdrawalRequest.findById(requestId);

        if (!withdrawalRequest) {
            return res.status(400).json({ error: 'Withdrawal request not found.', success: false });
        }

        if (withdrawalRequest.code !== parseInt(code, 10)) {
            return res.status(400).json({ error: 'Invalid verification code.', success: false });
        }

        withdrawalRequest.status = 'processing';
        withdrawalRequest.code = null;
        withdrawalRequest.processedDate = new Date();
        await withdrawalRequest.save();

        res.status(200).json({ message: 'Withdrawal request verified and is now processing.', success: true });
    } catch (error) {
        console.error('Error during code verification:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};

const fetchWithdrawalRequests = async (req, res) => {
    try {
        const withdrawalRequests = await WithdrawalRequest.find({ user: req.user._id }).select('-code -createdAt -user')
        if (!withdrawalRequests) {
            return res.status(400).json({ error: "No withdrawal request found", success: false })
        }

        return res.status(200).json({ message: "Withdrawal requested fetched successfully", success: true, withdrawalRequests })

    } catch (error) {
        console.error('Error during code verification:', error);
        res.status(500).json({ error: 'Internal server error', success: false });
    }
};


module.exports = {
    registerUser,
    loginUser,
    fetchCurrentUser,
    withdrawalRequest,
    directReferrals,
    updateUserDetails,
    changePassword,
    sendVerificationLink,
    verifyToken,
    verifyCode,
    fetchWithdrawalRequests
}