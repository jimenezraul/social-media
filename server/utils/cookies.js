module.exports = {
  getCookies: function (req) {
    const cookies = {};
    req.headers.cookie?.split(';').forEach((cookie) => {
      const [key, value] = cookie.split('=');
      cookies[key.trim()] = value;
    });
    return cookies;
  },
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
