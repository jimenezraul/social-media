const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

require("dotenv").config();

const userSchema = new Schema(
  {
    given_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    family_name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profileUrl: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    friendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    accessToken: {
      type: String,
    },
    refreshToken: [String],
    provider: {
      type: String,
      default: "email",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = +process.env.SALT_ROUNDS;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// get the post count
userSchema.virtual("postCount").get(function () {
  return this.posts.length;
});

const User = model("User", userSchema);

module.exports = User;
