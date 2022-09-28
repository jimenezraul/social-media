import { useState } from "react";

import { GoogleLogin, GoogleLogout } from "react-google-login";

import { useAppDispatch } from "../../app/hooks";
import { login } from "../../features/users/userSlice";
export const GoogleLoginButton = () => {
  const dispatch = useAppDispatch();
  const [profile, setProfile] = useState<String[] | null>(null);
  const clientId =
    "759091763684-s8i5j4sq4fr84mqneo6vaq7de4sdu7hd.apps.googleusercontent.com";

  console.log(profile);

  const onSuccess = (res: any) => {
    dispatch(login({ ...res.profileObj, provider: "google" }));
    localStorage.setItem(
      "user",
      JSON.stringify({ ...res.profileObj, provider: "google" })
    );
    console.log("success:", res);
  };

  const onFailure = (err: any) => {
    console.log("failure:", err);
  };

  const logOut = () => {
    setProfile(null);
  };

  return (
    <>
      {!profile ? (
        <GoogleLogin
          clientId={clientId}
          buttonText="Sign in with Google"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        />
      ) : (
        <GoogleLogout
          clientId={clientId}
          buttonText="Log out"
          onLogoutSuccess={logOut}
        />
      )}
    </>
  );
};
