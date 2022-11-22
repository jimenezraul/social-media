import FacebookLogin from '@greatsumini/react-facebook-login';
import { FACEBOOK_LOGIN } from '../../utils/mutations';
import { useMutation } from '@apollo/client';
import { useAppDispatch } from '../../app/hooks';
import { user_login, setAccessToken } from '../../features/users/userSlice';

interface FacebookLoginProps {
  setErrors: (message: string) => void;
}

interface FacebookLoginResponse {
  accessToken: string;
  expiresIn: string;
  reauthorize_required_in: string;
  signedRequest: string;
  userID: string;
}

const FacebookLoginButton = ({ setErrors }: FacebookLoginProps) => {
  const [facebookLogin] = useMutation(FACEBOOK_LOGIN);
  const dispatch = useAppDispatch();

  const facebookLoginHandler = async (token: string | undefined) => {
    if (!token) {
      setErrors('Facebook login failed');
    }

    try {
      const response = await facebookLogin({
        variables: {
          Token: token,
        },
      });

      const { success, message, access_token, user } = response.data.facebookLogin;

      if (!success) {
        setErrors(message);
        return;
      }

      localStorage.setItem('access_token', access_token);
      dispatch(user_login(user));
      dispatch(setAccessToken(access_token));
    } catch (err: any) {
      console.log(err.message);
      setErrors('Facebook login failed');
    }
  };

  return (
    <div className="w-[240px] flex justify-center items-center mt-5">
      <div className="flex w-full justify-center items-center bg-[#4267b2] hover:bg-[#385999] text-white h-10 rounded">
        <FacebookLogin
          appId="658646712381953"
          onSuccess={(response) => {
            response as FacebookLoginResponse;
            facebookLoginHandler(response?.accessToken);
          }}
          onFail={(error) => {
            console.log('Login Failed!', error);
          }}
          children={
            <div className="flex justify-center items-center">
              <i className="text-white text-xl fa-brands fa-facebook mr-2"></i>
              <span className="text-lg">Login with Facebook</span>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default FacebookLoginButton;
