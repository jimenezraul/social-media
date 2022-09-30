const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../../models');
const { generateToken, validToken } = require('../../utils/auth');
const { setCookie, clearCookie } = require('../../utils/cookies');
const { formatUserData } = require('../../utils/formatUserData');

module.exports = {
  // refresh access token
  refreshToken: async (parent, { id }, context) => {
    const refresh_token = context.headers.cookie?.split('=')[1];

    // clear httpOnly cookie
    clearCookie(context.res, 'refresh_token');

    if (!refresh_token) {
      throw new AuthenticationError('No refresh token found');
    }

    // check if refresh token is valid
    const isValidToken = validToken(refresh_token);

    const user = await User.findOne({ refreshToken: refresh_token });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    const newRefreshTokenArray = user.refreshToken.filter(
      (token) => token !== refresh_token
    );

    // Refresh token expired
    if (!isValidToken) {
      user.refreshToken = newRefreshTokenArray;
      await user.save();
      throw new AuthenticationError(
        'Refresh token expired, please login again'
      );
    }

    const currentUser = formatUserData(user);

    // generate new refresh token and save to user
    const newRefreshToken = generateToken({ user: currentUser }, 'refresh');
    user.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await user.save();

    // generate new access token
    const accessToken = generateToken({ user: currentUser });

    // set httpOnly cookie
    setCookie(context.res, 'refresh_token', newRefreshToken);

    return {
      success: true,
      message: 'Access token refreshed successfully',
      access_token: accessToken,
      user: currentUser,
    };
  },
};
