const { GraphQLError } = require('graphql');
const { User } = require('../../models');
const cookies = require('../../utils/cookies');

module.exports = {
  // logout user
  logout: async (parent, args, context) => {
    const refreshToken = context.signedCookies.refresh_token;

    if (!refreshToken) {
      throw new GraphQLError('No refresh token found', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
    }

    // clear httpOnly cookie
    cookies.removeCookie(context.res, 'refresh_token', { maxAge: -1 });

    const user = await User.findOne({ refreshToken: refreshToken });

    if (!user) {
      throw new GraphQLError('User not found', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
    }

    const newRefreshTokenArray = user.refreshToken.filter(
      (token) => token !== refreshToken
    );

    await User.findOneAndUpdate(
      { refreshToken: refreshToken },
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
