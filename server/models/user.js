const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const User = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: "Username is Required",
  },
  password: {
    type: String,
    trim: true,
    required: "Password is Required",
    minlength: 6,
  },
  email: {
    type: String,
    unique: true,
    match: [/.+@.+\..+/],
  },
  cardio: [{
    type: Schema.Types.ObjectId,
    ref: "Cardio"
  }],
  physcial: [{
    type: Schema.Types.ObjectId,
    ref: "Physical"
  }]
});

// hash user password
User.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method to compare and validate password for logging in
User.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const user = model("User", User);

module.exports = user;
