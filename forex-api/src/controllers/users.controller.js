const sendVerificationEmail = require("../middleware/sendVerificationCode");
const User = require("../models/user.model");
const { isValidEmail, isValidPassword, isValidPhone } = require("../utils/helper");
const { serialize } = require("cookie");
const jwt = require("jsonwebtoken");
const Wallet = require("../models/wallet.model");
const WithdrawalRequest = require("../models/withdrawalRequest.model");
const { generatebipWallet, encryptPrivateKey, generateQRCode } = require("../utils/generateWallet");
const createAccessLog = require("../utils/accessLog");

const registerUser = async (req, res) => {
    const { email, password, firstName, lastName, phone, referredBy, terms, country } = req.body;

    if ([email, password, firstName, referredBy].some(field => !field?.trim())) {
        return res.status(400).json({ error: 'Please provide valid information.', success: false });
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

        
        const referredUser = await User.findOne({ username: referredBy }).lean().exec();
        if (!referredUser) {
            return res.status(400).json({ error: 'Invalid referral ID', success: false });
        }


        // Generate a unique username
        const generateUniqueUsername = async () => {
            let username;
            let existingUsername;
            do {
                username = Math.floor(10000000 + Math.random() * 90000000).toString();
                existingUsername = await User.findOne({ username }).lean().exec();
            } while (existingUsername);

            return username;
        };

        // Generate a unique username
        const username = await generateUniqueUsername();

        // Count existing users to determine new index
        const userCount = await User.countDocuments();

        // Generate wallet
        const wallet = await generatebipWallet(process.env.MNEMONIC_PHRASE, userCount);

        // Generate Qr code
        const qrCode = await generateQRCode(wallet.address);

        // Save user to database
        const newUser = new User({
            username,
            email,
            password,
            firstName,
            lastName: lastName?.trim() || '',
            referralId: username.toLowerCase(),
            referredBy: referredUser?._id || null,
            phone: phone?.trim() || '',
            tc: terms,
            country: country
        });

        await newUser.save();

        // Save wallet to database
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
}

const fetchCurrentUser = async (req, res) => {
    return res.status(200).json({ sucsess: true, message: "User details fetched Successfully", user: req.user })
}

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
}

// find the direct referrals and chain up to 15 level
const directReferrals = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1; // Current page, default to 1
        const limit = parseInt(req.query.limit) || 10; // Items per page, default to 10

        // Fetch direct referrals of the current user
        const directReferrals = await User.find({ referredBy: userId })
            .select("username createdAt")
            .skip((page - 1) * limit)
            .limit(limit);

        // Function to recursively find referral chain with firstName and email up to 15 levels deep
        const findReferralChain = async (userIds, chain = [], level = 1, maxUsers = 1000) => {
            if (level > 15 || chain.length >= maxUsers) return chain;

            const referrals = await User.find({ referredBy: { $in: userIds } })
                .select('username createdAt referredBy');

            if (referrals.length === 0) return chain;

            referrals.forEach(referral => {
                chain.push({
                    level,
                    firstName: referral.firstName,
                    email: referral.email,
                    createdAt: referral.createdAt,
                    referredBy: referral.referredBy
                });
            });

            if (chain.length >= maxUsers) return chain;

            const nextLevelUserIds = referrals.map(referral => referral._id);
            return await findReferralChain(nextLevelUserIds, chain, level + 1, maxUsers);
        };

        // Fetch the user who referred the current user
        const referringUser = await User.findById(userId).select('referredBy');
        let referralChain = [];

        if (referringUser && referringUser.referredBy) {
            // Get referral chain up to 15 levels deep for the referring user
            referralChain = await findReferralChain([referringUser.referredBy], referralChain, 2);
        }

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
}


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

        const withdrawalRequest = new WithdrawalRequest({
            user: userId,
            amount: amount,
            requestDate: new Date(), // Use new Date() for current date
            walletAddress: walletAddress,
            status: "pending"
        });

        await withdrawalRequest.save();

        res.status(200).json({ message: 'Withdrawal request created successfully.', success: true });
    } catch (error) {
        console.error('Error during withdrawal request:', error);
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
    changePassword
}