const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true

  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Only Gmail addresses are allowed"]

  },
  password: {
    type: String,
    required: true
  },
  confirm_Password: {
    type: String,
    required: false,

  },

  mobile: {
    type: String,
    required: function () {
      return this.role === "student";
    },
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit mobile number!`
    }
  },

  address: {
    type: String,
    required: function () {
      return this.role === 'student';
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: function () {
      return this.role === 'student';
    }
  },
  dob: {
    type: Date,
    required: function () {
      return this.role === 'student';
    }
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  googleId: String,
  githubId: String,
  facebookId: String,
  avatar: String,
}, { timestamps: true });

// Password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // skip if password not changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
