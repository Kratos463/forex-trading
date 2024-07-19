const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcryptjs = require("bcryptjs");

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9]+$/.test(v);
      },
      message: props => `${props.value} is not a valid username! Must contain only alphanumeric characters.`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (v) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(v);
      },
      message: props => `Password validation failed!`
    }
  },
  fullName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number! Must be exactly 10 digits.`
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
    type: Number,
    default: null
  },
  otpExpiry: {
    type: Date,
    default: null
  },
  forgotPasswordToken: {
    type: String,
    default: null
  },
  forgotPasswordTokenExpiry: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

adminSchema.pre('save', function (next) {
  if (this.isModified('username')) {
    this.username = this.username.toLowerCase();
  }
  next();
});

// Hash password before saving
adminSchema.pre("save", async function (next) {
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
adminSchema.methods.isPasswordCorrect = async function (password) {
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

// Static method to find admin by email
adminSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

// Instance method to generate forgot password token
adminSchema.methods.generateForgotPasswordToken = function () {
  const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
  const generatedToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  this.forgotPasswordToken = generatedToken;
  this.forgotPasswordTokenExpiry = Date.now() + expirationTime;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
