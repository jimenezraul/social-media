import { useRef, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import jwt_decode from "jwt-decode";
import { login } from "../../features/users/userSlice";

export const GoogleLoginButton = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const clientId =
    "759091763684-s8i5j4sq4fr84mqneo6vaq7de4sdu7hd.apps.googleusercontent.com";

  useEffect(() => {
    if (scriptLoaded) return undefined;

    function handleGoogleSignIn(res: any) {
      const decodeUser = jwt_decode(res?.credential as string);
      localStorage.setItem("user", JSON.stringify(decodeUser));
      dispatch(login(Object(decodeUser)));
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
  }, [dispatch, clientId, scriptLoaded]);

  return (
    <>
      <div ref={divRef} />
    </>
  );
};
