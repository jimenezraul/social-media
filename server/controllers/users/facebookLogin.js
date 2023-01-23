const { GraphQLError } = require('graphql');
const { User } = require('../../models');
const { generateToken } = require('../../utils/auth');
const cookies = require('../../utils/cookies');
const { formatUserData } = require('../../utils/formatUserData');

const https = require('https');
require('dotenv').config();

module.exports = {
  facebookLogin: async (parent, { fbAccessToken }, context) => {
    const url = `https://graph.facebook.com/v15.0/me?fields=first_name,last_name,picture.width(200).height(200),email&access_token=${fbAccessToken}`;

    const response = await new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            resolve(JSON.parse(data));
          });
        })
        .on('error', (err) => {
          reject(err);
        });
    });

    const { email, first_name, last_name, picture } = response;

    if (!email) {
      throw new GraphQLError('Something went wrong!', {
        code: 'FORBIDDEN',
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      const newUser = await User.create({
        email,
        given_name: first_name,
        family_name: last_name,
        profileUrl: picture.data.url,
        provider: 'facebook',
        isVerified: true,
        password: process.env.FACEBOOK_CLIENT_SECRET,
      });

      const data = formatUserData(newUser);
      const access_token = generateToken({ user: data });
      const refresh_token = generateToken({ user: data }, 'refresh');

      cookies.setCookie(context.res, 'refresh_token', refresh_token, {
        signed: true,
      });

      newUser.refreshToken = [refresh_token];
      await newUser.save();

      return {
        success: true,
        message: 'User created successfully!',
        access_token,
        isLoggedIn: true,
        user: data,
      };
    }

    if (user.provider !== 'facebook') {
      return {
        success: false,
        message: `Try to sign in with ${user.provider}!`,
        access_token: null,
        isLoggedIn: false,
        user: null,
      };
    }

    const currentRefreshToken = user.refreshToken;
    const userData = formatUserData(user);
    const access_token = generateToken({ user: userData });
    const refresh_token = generateToken({ user: userData }, 'refresh');

    cookies.setCookie(context.res, 'refresh_token', refresh_token, {
      signed: true,
    });

    user.refreshToken = [...currentRefreshToken, refresh_token];
    await user.save();

    return {
      success: true,
      message: 'User logged in successfully',
      access_token,
      isLoggedIn: true,
      user: userData,
    };
  },
};
