const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 35
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 254,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    failedLoginAttempts: {
      type: Number,
      default: 0

    },
    accountLockedUntil: {
      type: Date,
      default: null
    },
    lastLoginIP: String,
    lastLoginAt: Date,
    loginHistory: [{
      timestamp: { type: Date, default: Date.now },
      ipAddress: String,
      userAgent: String,
      success: Boolean
    }]
  },
  { timestamps: true }
);

// Static Registration Function
userSchema.statics.register = async (name, email, password) => {
  const exists = await User.findOne({ email })
  if (exists) {
    throw Error("Email already exists")
  }
  const pepper = process.env.PASSWORD_PEPPER
  const passwordWithPepper = password + pepper;
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(passwordWithPepper, salt)

  const user = await User.create({ name, email, password: hash })
  return user;
}


// Static Login Function
userSchema.statics.login = async function(email, password, ipAddress, userAgent) {
  const user = await User.findOne({ email })
  if (!user) {
    throw Error("User doesn't exists")
  }
  const currentTime = new Date();
  const isAccountLocked = user.accountLockedUntil && user.accountLockedUntil > currentTime;

  if (isAccountLocked) {
    const remainingLockTimeMs = user.accountLockedUntil - currentTime;
    const remainingMinutes = Math.ceil(remainingLockTimeMs / (1000 * 60));
    user.loginHistory.push({
      ipAddress,
      userAgent,
      success: false
    })
    await user.save();
    throw new Error(`Account is locked please try again after ${remainingMinutes} minutes`)
  }
  const pepper = process.env.PASSWORD_PEPPER;
  const passwordWithPepper = password + pepper;
  const isPasswordCorrect = await bcrypt.compare(passwordWithPepper, user.password)
  if (!isPasswordCorrect) {
    const newFailedAttempts = user.failedLoginAttempts + 1;
    user.loginHistory.push({
      ipAddress,
      userAgent,
      success: false
    })
    if (newFailedAttempts >= 3) {
      const LockUntilTime = new Date(Date.now() + (5 * 60 * 1000));
      await this.findByIdAndUpdate(user._id, {
        failedLoginAttempts: newFailedAttempts,
        accountLockedUntil: LockUntilTime
      });
    } else {
      await this.findByIdAndUpdate(user._id, {
        failedLoginAttempts: newFailedAttempts
      });
    }
    throw new Error("Incorrect password");
  }
  await this.findByIdAndUpdate(user._id, {
    failedLoginAttempts: 0,
    accountLockedUntil: null,
    lastLoginIP: ipAddress,
    lastLoginAt: new Date(),
    $push: {
      loginHistory: {
        ipAddress,
        userAgent,
        success: true
      }
    }
  });
  return user;
}
userSchema.methods.toSafeObject = function () {
  return {
    name: this.name,
    email: this.email
  };
};
const User = mongoose.model("User", userSchema);
module.exports = User;

