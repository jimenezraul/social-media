export const getNewToken = async () => {
  try {
    const loggedInUser = JSON.parse(localStorage.getItem("user")!);
    const token = localStorage.getItem("access_token");

    var graphql: any = JSON.stringify({
      query:
        "mutation RefreshToken($userId: ID!) {\r\n  refreshToken(id: $userId) {\r\n    success\r\n    message\r\n    access_token\r\n    user {\r\n      _id\r\n      given_name\r\n      family_name\r\n      profileUrl\r\n      isAdmin\r\n      isVerified\r\n    }\r\n    isLoggedIn\r\n  }\r\n}",
      variables: { userId: loggedInUser._id },
    });

    const response = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        credentials: "include",
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

      localStorage.setItem("user", JSON.stringify(user));
      if (access_token) {
        localStorage.setItem("access_token", access_token);
      }
      return access_token;
    }
    return new Error("Something went wrong");
  } catch (err: any) {
    if (err.message === "Refresh token expired, please login again") {
      localStorage.clear();
      window.location.reload();
    }
  }
};
