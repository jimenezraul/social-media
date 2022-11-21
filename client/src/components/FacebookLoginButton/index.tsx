import FacebookLogin from '@greatsumini/react-facebook-login';

interface FacebookLoginProps {
  setErrors: (message: string) => void;
}

interface FacebookLoginResponse {
  email: string;
  name: string;
  id: string;
  picture: {
    data: {
      url: string;
    };
  };
}

const FacebookLoginButton = ({ setErrors }: FacebookLoginProps) => {
  return (
    <div className="w-[258px] flex justify-center items-center mt-5 px-[10px] py-[2px]">
      <div className="flex w-full justify-center items-center bg-[#4267b2] hover:bg-[#385999] text-white px-4 py-2 rounded">
        <i className="text-white text-xl fa-brands fa-facebook mr-3"></i>
        <FacebookLogin
          appId="658646712381953"
          onSuccess={(response) => {
            console.log('Login Success!', response);
          }}
          onFail={(error) => {
            console.log('Login Failed!', error);
            setErrors('Login Failed');
          }}
          onProfileSuccess={(response) => {
            console.log('Get Profile Success!', response);
            const res = response as FacebookLoginResponse;
            const fullname = res.name.split(' ');
            const given_name = fullname[0];
            const family_name = fullname[1];
            const picture = res.picture.data.url;
            const email = res.email;
            console.log(given_name);
          }}
        />
      </div>
    </div>
  );
};

export default FacebookLoginButton;
