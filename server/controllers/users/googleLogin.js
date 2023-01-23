const { OAuth2Client } = require('google-auth-library');
const { User } = require('../../models');
const authMiddleware = require('../../utils/auth');
const { GraphQLError } = require('graphql');
const { formatUserData } = require('../../utils/formatUserData');
const cookies = require('../../utils/cookies');
require('dotenv').config();

module.exports = {
  googleLogin: async (parent, args, context) => {
    const refresh_token = context.headers.cookie?.split('refresh_token=')[1];
    const { tokenId } = args;
    cookies.removeCookie(context.res, 'refresh_token');

    if (!tokenId) {
      throw new GraphQLError('You need to be logged in with Google!', {
        code: 'FORBIDDEN',
      });
    }

    if (refresh_token) {
      await User.findOneAndUpdate(
        { refreshToken: refresh_token },
        { $pull: { refreshToken: refresh_token } }
      );
      cookies.removeCookie(context.res, 'refresh_token');
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
   
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      if (
        !ticket.getPayload() ||
        ticket.getPayload().aud !== process.env.GOOGLE_CLIENT_ID
      ) {
        throw new GraphQLError('Invalid token!', {
          extensions: {
            code: 'FORBIDDEN',
          },
        });
      }

      const payload = ticket.getPayload();
      const { email, given_name, family_name, picture } = payload;

      const user = await User.findOne({ email: email });

      if (!user) {
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
        const access_token = authMiddleware.generateToken({ user: data });
        const refreshToken = authMiddleware.generateToken({ user: data }, 'refresh_token');

        cookies.setCookie(context.res, 'refresh_token', refreshToken, {
          signed: true,
        });

        newUser.refreshToken = [refreshToken];
        await newUser.save();

        return {
          success: true,
          message: 'User created successfully',
          access_token: access_token,
          user: newUser,
          isLoggedIn: true,
        };
      }

      // if user exists but user registered with email and password
      // and trying to login with google, throw error
      if (user && user.provider !== 'google') {
        return {
          success: false,
          message: `Try to sign in with ${user.provider}!`,
          access_token: null,
          isLoggedIn: false,
          user: null,
        };
      }

      const currentRefreshToken = user.refreshToken;
      const data = formatUserData(user);

      const access_token = authMiddleware.generateToken({ user: data });
      const refresh_token = authMiddleware.generateToken({ user: data }, 'refresh_token');

      cookies.setCookie(context.res, 'refresh_token', refresh_token,{
        signed: true,
      });

      user.refreshToken = [...currentRefreshToken, refresh_token];
      await user.save();

      return {
        success: true,
        message: 'User logged in',
        access_token: access_token,
        user: user,
        isLoggedIn: true,
      };
    }

    return verify().catch(console.error);
  },
};
