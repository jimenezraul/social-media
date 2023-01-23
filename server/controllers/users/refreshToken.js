const { GraphQLError } = require('graphql');
const { User } = require('../../models');
const authMiddleware = require('../../utils/auth');
const cookies = require('../../utils/cookies');
const { formatUserData } = require('../../utils/formatUserData');

module.exports = {
  // refresh access token
  refreshToken: async (parent, { id }, context) => {
    const refresh_token = await context.signedCookies.refresh_token;

    if (!refresh_token) {
      throw new GraphQLError('No refresh token found', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
    }
    // check if refresh token is valid
    const isValidToken = authMiddleware.validateToken(refresh_token);

    // user that has refresh token in the refreshToken array
    const user = await User.findOne({
      _id: id,
    });

    if (!user) {
      console.log('user not found');
      throw new GraphQLError('User not found', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
    }

    if (!user?.refreshToken.includes(refresh_token)) {
      throw new GraphQLError('Refresh token not found', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
    }

    const newRefreshTokenArray = user.refreshToken.filter(
      (token) => token !== refresh_token
    );

    const filteredExpiredTokenArray = newRefreshTokenArray.filter((token) =>
      authMiddleware.validateToken(token)
    );

    // Refresh token expired
    if (!isValidToken) {
      cookies.removeCookie(context.res, 'refresh_token', { maxAge: -1 });
      user.refreshToken = newRefreshTokenArray;
      await user.save();
      throw new GraphQLError('Refresh token expired, please login again', {
        extensions: {
          code: 'FORBIDDEN',
        },
      });
    }

    const currentUser = formatUserData(user);

    // generate new refresh token and save to user
    const newRefreshToken = authMiddleware.generateToken(
      { user: currentUser },
      'refresh_token'
    );

    user.refreshToken = [...filteredExpiredTokenArray, newRefreshToken];
    await user.save();

    // generate new access token
    const accessToken = authMiddleware.generateToken({ user: currentUser });
    cookies.removeCookie(context.res, 'refresh_token');
    // set httpOnly cookie
    cookies.setCookie(context.res, 'refresh_token', newRefreshToken, {
      signed: true,
    });

    return {
      success: true,
      message: 'Access token refreshed successfully',
      access_token: accessToken,
      user: currentUser,
    };
  },
};
