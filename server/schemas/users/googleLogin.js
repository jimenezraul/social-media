const { OAuth2Client } = require('google-auth-library');
const { User } = require('../../models');
const { generateToken } = require('../../utils/auth');
const { AuthenticationError } = require('apollo-server-express');
const { validToken } = require('../../utils/auth');
const { formatUserData } = require('../../utils/formatUserData');
const { setCookie, clearCookie } = require('../../utils/cookies');
require('dotenv').config();

module.exports = {
  googleLogin: async (parent, args, context) => {
    const refresh_token = context.headers.cookie?.split('=')[1];
    const url = 'https://www.googleapis.com/userinfo/v2/me';

    let tokenId =
      context.headers.authorization || context.headers.Authorization;
    tokenId = tokenId?.split(' ').pop().trim();

    if (!tokenId) {
      throw new AuthenticationError('You need to be logged in with Google!');
    }

    // if we have a refresh token, verify it and get user data
    if (refresh_token) {
      const isValid = validToken(refresh_token);

      if (!isValid) {
        clearCookie(context.res, 'refresh_token');
        throw new AuthenticationError('You need to try logging in again!');
      }

      const user = await User.findOne({
        refreshToken: refresh_token,
      }).select('given_name family_name email isVerified isAdmin profileUrl');

      if (!user) {
        clearCookie(context.res, 'refresh_token');
        throw new AuthenticationError('You need to try logging in again!');
      }

      const access_token = generateToken({ user: user });

      return {
        success: true,
        message: 'You are logged in!',
        access_token: access_token,
        user: user,
        isLoggedIn: true,
      };
    }

    const client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });

    client.setCredentials({ access_token: tokenId });
    const oAuth2Client = client;
    const res = await oAuth2Client.request({ url });

    // if we don't get data back from Google, throw an error
    if (!res.data) {
      throw new AuthenticationError('User not found');
    }

    const { email, picture, given_name, family_name } = res.data;

    const user = await User.findOne({ email });

    // if user exists but user registered with email and password
    // and trying to login with google, throw error
    if (user && user.provider !== 'google') {
      throw new AuthenticationError(
        'Please login with your email and password'
      );
    }

    // if user exists, return user
    if (user) {
      const currentRefreshToken = user.refreshToken;
      const data = formatUserData(user);

      const access_token = generateToken({ user: data });
      const refresh_token = generateToken({ user: data }, 'refresh');

      user.refreshToken = [...currentRefreshToken, refresh_token];
      await user.save();

      setCookie(context.res, 'refresh_token', refresh_token);

      return {
        success: true,
        message: 'User logged in',
        access_token: access_token,
        user: user,
        isLoggedIn: true,
      };
    }

    // if user does not exist, create new user
    const newUser = await User.create({
      email,
      given_name,
      family_name,
      profileUrl: picture,
      provider: 'google',
      isVerified: true,
      password: process.env.GOOGLE_CLIENT_SECRET,
    });

    const data = formatUserData(newUser);
    const access_token = generateToken({ user: data });
    const refreshToken = generateToken({ user: data }, 'refresh');

    setCookie(context.res, 'refresh_token', refreshToken);

    newUser.refreshToken = [refreshToken];
    await newUser.save();

    return {
      success: true,
      message: 'User created successfully',
      access_token: access_token,
      user: newUser,
      isLoggedIn: true,
    };
  },
};
