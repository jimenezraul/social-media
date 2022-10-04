const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../../models');
const { clearCookie } = require('../../utils/cookies');

module.exports = {
  // logout user
  logout: async (parent, args, context) => {
    const token = context.headers.cookie.split('refresh_token=')[1];

    if (!token) {
      throw new AuthenticationError('No refresh token found');
    }

    // clear httpOnly cookie
    clearCookie(context.res, 'refresh_token');

    const user = await User.findOne({ refreshToken: token });

    if (!user) {
      throw new AuthenticationError('User not found');
    }
    console.log('token', token);
    console.log('refresh token: ', user.refreshToken);
    const newRefreshTokenArray = user.refreshToken.filter(
      (token) => token !== token
    );

    await User.findOneAndUpdate(
      { refreshToken: token },
      { $set: { refreshToken: newRefreshTokenArray } },
      { new: true }
    );

    return {
      success: true,
      message: 'User logged out successfully',
      isLoggedIn: false,
    };
  },
};
