module.exports = {
  setCookie: (res, name, token) => {
    res.cookie(name, token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  },
  clearCookie: (res, name) => {
    res.clearCookie(name, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
  },
};
