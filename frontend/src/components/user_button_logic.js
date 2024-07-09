import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import LoginButton from "./login_button";
import LogoutButton from "./logout_button";

function UserButton() {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  useEffect(() => {
    const handleLogin = (e) => {
      console.log("User logged in:", e.detail);
      console.log("user details", user);
      // Perform your desired actions on user login (e.g., fetch user data, send analytics)
    };

    if (!isAuthenticated) {
      window.addEventListener("auth0:login-success", handleLogin);
    }

    return () => {
      window.removeEventListener("auth0:login-success", handleLogin);
    };
  }, [isAuthenticated]);

  return <div>{isAuthenticated ? <LogoutButton /> : <LoginButton />}</div>;
}

export default UserButton;
