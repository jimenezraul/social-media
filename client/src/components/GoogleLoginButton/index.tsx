import { GoogleLogin } from '@react-oauth/google';
import { useMutation } from '@apollo/client';
import { GOOGLE_LOGIN } from '../../utils/mutations';
import { useAppDispatch } from '../../app/hooks';
import { user_login, setAccessToken } from '../../features/users/userSlice';

interface GoogleLoginProps {
    setErrors: (message: string) => void;
}

const GoogleLoginButton = ({setErrors}: GoogleLoginProps) => {
  const [googleLogin] = useMutation(GOOGLE_LOGIN);
  const dispatch = useAppDispatch();

  const handleGoogleLogin = async (response: any) => {
    try {
      const google_login = await googleLogin({
        variables: {
          tokenId: response.credential,
        },
      });

      const { success, message, access_token, user } = google_login.data.googleLogin;

      if (!success) {
        setErrors(message);
        return;
      }

      localStorage.setItem('user', JSON.stringify(user));
      dispatch(user_login(user));
      dispatch(setAccessToken(access_token));
    } catch (err: any) {
      console.log(err.message);
      setErrors('Google login failed');
    }
  };

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        handleGoogleLogin(credentialResponse);
      }}
      onError={() => {
        setErrors('Login Failed');
      }}
      useOneTap
    />
  );
};

export default GoogleLoginButton;