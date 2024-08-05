const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcryptjs = require("bcryptjs");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                // Regex to check if the username contains lowercase letters, numbers, underscores, and special characters
                return /^[a-z0-9_\-!@#$%^&*()+=?<>.,;:'"/[\]{}`~|]{4,}$/.test(v);
            },
            message: props => `Username must be at least 4 characters long and contain only lowercase letters, numbers, and special characters like _ - ! @ # $ % ^ & * ( ) + = ? < > . , ; : ' " / [ ] { } \` ~ |`
        }
    },
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true,
        validate: {
            validator: function (v) {
                // Regex for basic email format validation
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    phone: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8, // Password should be at least 8 characters long
        validate: {
            validator: function (v) {
                // Example: Password must contain at least one uppercase letter, one lowercase letter, and one digit
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v);
            },
            message: props => `Password validation failed!`
        }
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    tc: {
        type: Boolean,
        default: false,
        required: true
    },
    forgotPasswordToken: {
        type: String,
        default: null
    },
    forgotPasswordTokenExpiry: {
        type: Date,
        default: null
    },
    ismarketingId: {
        type: Boolean,
        default: false,
    },
    profileQr: {
        type: string,
        required: true
    },
    referralId: { type: String, required: true, unique: true },
    walletId: { type: Schema.Types.ObjectId, ref: 'Wallet' },
    referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    investments: [{ type: Schema.Types.ObjectId, ref: 'Investment' }],
    referrals: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });


userSchema.pre('save', function (next) {
    if (this.isModified('username')) {
        this.username = this.username.toLowerCase();
    }
    next();
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const hashedPassword = await bcryptjs.hash(this.password, 12);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Method to verify password
userSchema.methods.isPasswordCorrect = async function (password) {
    try {
        if (!password || typeof password !== 'string') {
            throw new Error("Invalid password");
        }
        return await bcryptjs.compare(password, this.password);
    } catch (error) {
        console.error("Error in isPasswordCorrect:", error);
        return false;
    }
};

// Static method to find user by email or username
userSchema.statics.findByEmailOrUsername = function (identifier) {
    return this.findOne({ $or: [{ username: identifier }, { email: identifier }] });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
