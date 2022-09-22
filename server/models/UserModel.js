const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const date = require('date-and-time');

require('dotenv').config();

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
      // unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    profileUrl: {
      type: String,
      default: '/assets/img/default-user.png',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    friendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    friendRequestCount: {
      type: Number,
      default: 0,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    accessToken: {
      type: String,
    },
    refreshToken: [String],
    provider: {
      type: String,
      default: 'email',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = +process.env.SALT_ROUNDS;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// get the post count
userSchema.virtual('postCount').get(function () {
  return this.posts.length;
});

// get full name
userSchema.virtual('fullName').get(function () {
  return `${this.given_name} ${this.family_name}`;
});

// friend count
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// format createdAt date
userSchema.virtual('createdAtFormatted').get(function () {
  return date.format(this.createdAt, 'dddd MMM DD, YYYY');
});

const User = model('User', userSchema);

module.exports = User;
