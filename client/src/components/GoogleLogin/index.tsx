import { useRef, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { login, setAccessToken } from "../../features/users/userSlice";
import { useMutation } from "@apollo/client";
import { GOOGLE_LOGIN } from "../../utils/mutations";

export const GoogleLoginButton = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [googleLogin] = useMutation(GOOGLE_LOGIN);

  const clientId =
    "759091763684-s8i5j4sq4fr84mqneo6vaq7de4sdu7hd.apps.googleusercontent.com";

  useEffect(() => {
    if (scriptLoaded) return undefined;

    async function handleGoogleSignIn(res: any) {
      const tokenId = res.credential;

      const google_login = await googleLogin({
        variables: {
          tokenId: tokenId,
        },
      });

      const { success, message, access_token, user } =
        google_login.data.googleLogin;

      if (!success) {
        return alert(message);
      }

      localStorage.setItem("user", JSON.stringify(user));
      dispatch(login(user));
      dispatch(setAccessToken(access_token));
    }
    setScriptLoaded(true);
    const initializeGoogle = () => {
      if (!window.google || scriptLoaded) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (res) => handleGoogleSignIn(res),
      });
      window.google.accounts.id.renderButton(divRef.current as HTMLDivElement, {
        theme: "filled_blue",
        size: "large",
        text: "signin_with",
        type: "standard",
      });
      window.google.accounts.id.prompt();
    };
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = initializeGoogle;
    script.async = true;
    script.id = "google-client-script";
    document.body.appendChild(script);

    return () => {
      window.google?.accounts.id.cancel();
      document.getElementById("google-client-script")?.remove();
    };
  }, [dispatch, clientId, scriptLoaded, googleLogin]);

  return (
    <>
      <div ref={divRef} />
    </>
  );
};
