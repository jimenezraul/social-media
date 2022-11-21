const { GraphQLError } = require('graphql')
const { User } = require('../../models');
const { generateToken, validToken } = require('../../utils/auth');
const { setCookie, clearCookie } = require('../../utils/cookies');
const { formatUserData } = require('../../utils/formatUserData');

module.exports = {
  // refresh access token
  refreshToken: async (parent, { id }, context) => {
    const refresh_token = await context.headers.cookie?.split(
      'refresh_token='
    )[1];

    if (!refresh_token) {
      throw new ForbiddenError('No refresh token found');
    }
    // check if refresh token is valid
    const isValidToken = validToken(refresh_token);

    // user that has refresh token in the refreshToken array
    const user = await User.findOne({
      _id: id,
    });

    if (!user) {
      console.log("user not found");
      throw new ForbiddenError('User not found');
    }
    
    if (!user?.refreshToken.includes(refresh_token)) {
      throw new ForbiddenError('Refresh token not found');
    }

    const newRefreshTokenArray = user.refreshToken.filter(
      (token) => token !== refresh_token
    );

    const filteredExpiredTokenArray = newRefreshTokenArray.filter(
      (token) => validToken(token)
    );

    // Refresh token expired
    if (!isValidToken) {
      clearCookie(context.res, 'refresh_token');
      user.refreshToken = newRefreshTokenArray;
      await user.save();
      throw new ForbiddenError(
        'Refresh token expired, please login again'
      );
    }

    const currentUser = formatUserData(user);

    // generate new refresh token and save to user
    const newRefreshToken = generateToken({ user: currentUser }, 'refresh');

    user.refreshToken = [...filteredExpiredTokenArray, newRefreshToken];
    await user.save();

    // generate new access token
    const accessToken = generateToken({ user: currentUser });
    clearCookie(context.res, 'refresh_token');
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
