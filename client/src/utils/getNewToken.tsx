import { store } from '../app/store';
import { setAccessToken } from '../features/users/userSlice';

export const getNewToken = async () => {
  const { user } = store.getState();

  try {
    var graphql: any = JSON.stringify({
      query:
        'mutation RefreshToken($userId: ID!) {\r\n  refreshToken(id: $userId) {\r\n    success\r\n    message\r\n    access_token\r\n    user {\r\n      _id\r\n      given_name\r\n      family_name\r\n      profileUrl\r\n      isAdmin\r\n      isVerified\r\n    }\r\n    isLoggedIn\r\n  }\r\n}',
      variables: { userId: user.user?._id },
    });

    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: graphql,
    })!;

    if (response.ok) {
      const res = await response.json();

      const { data, errors } = await res;

      if (errors) {
        throw new Error(errors[0].message);
      }

      const { success, message, access_token, user } = await data?.refreshToken;

      if (!success) {
        console.log(message);
        return;
      }

      localStorage.setItem('user', JSON.stringify(user));
      if (access_token) {
        store.dispatch(setAccessToken(access_token));
      }
      return access_token;
    }

    throw new Error('No Refresh Token');
  } catch (err: any) {
    if (
      err.message === 'Refresh token expired, please login again' ||
      err.message === 'No refresh token found' ||
      err.message === 'User not found'
    ) {
      localStorage.clear();
      window.location.reload();
    }
  }
};
