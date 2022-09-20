module.exports = {
  formatUserData: (user) => {
    return {
      _id: user._id,
      email: user.email,
      given_name: user.given_name,
      family_name: user.family_name,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      profileUrl: user.profileUrl,
    };
  },
};
