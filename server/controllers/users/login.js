const { GraphQLError } = require('graphql');
const { User } = require('../../models');
const { generateToken } = require('../../utils/auth');
const { formatUserData } = require('../../utils/formatUserData');
const cookies = require('../../utils/cookies');

module.exports = {
  // login a user
  login: async (parent, { email, password }, context) => {
    const refresh_token = context.headers.cookie?.split('=')[1];
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new GraphQLError('Incorrect email or password', {
        code: 'INCORRECT_EMAIL_OR_PASSWORD',
      });
    }

    const correctPw = await user.isCorrectPassword(password);
    console.log(correctPw);
    if (!correctPw) {
      throw new GraphQLError('Incorrect email or password', {
        code: 'INCORRECT_EMAIL_OR_PASSWORD',
      });
    }

    if (!user.isVerified) {
      throw new GraphQLError('Please verify your email', {
        code: 'EMAIL_NOT_VERIFIED',
      });
    }

    // user data to be sent to client
    const data = formatUserData(user);

    //generate new tokens
    const accessToken = generateToken({ user: data });
    const refreshToken = generateToken({ user: data }, 'refresh');

    // If refresh token exists in cookie, get new array of tokens without the old refresh token
    let newRefreshTokenArray = !refresh_token
      ? user.refreshToken
      : user.refreshToken.filter((token) => token !== refresh_token);

    if (refresh_token) {
      // clear httpOnly cookie
      cookies.removeCookie(context.res, 'refresh_token');
    }

    // save tokens to user
    user.refreshToken = [...newRefreshTokenArray, refreshToken];
    await user.save();

    // set httpOnly cookie
    cookies.setCookie(context.res, 'refresh_token', refreshToken,{
      signed: true,
    });

    return {
      success: true,
      message: 'Logged in successfully',
      access_token: accessToken,
      user,
      isLoggedIn: true,
    };
  },
};
