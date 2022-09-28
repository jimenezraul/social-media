import { BrowserRouter as Router } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useAppDispatch } from "./app/hooks";
import { login } from "./features/users/userSlice";

import { useGoogleLogin } from "react-google-login";

import AppRoutes from "./routes";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

function App() {
  const dispatch = useAppDispatch();

  const onSuccess = (res: any) => {
    dispatch(login({...res.profileObj, provider: "google"}));
  };

  useGoogleLogin({
    onSuccess: (res) => onSuccess(res),
    onFailure: (err) => console.log(err),
    clientId:
      "759091763684-s8i5j4sq4fr84mqneo6vaq7de4sdu7hd.apps.googleusercontent.com",
    isSignedIn: true,
    accessType: "offline",
  });

  return (
    <ApolloProvider client={client}>
      <Router>
        <AppRoutes />
      </Router>
    </ApolloProvider>
  );
}

export default App;
