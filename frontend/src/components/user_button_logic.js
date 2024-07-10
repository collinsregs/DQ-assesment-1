import { useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./login_button";
import LogoutButton from "./logout_button";

function UserButton() {
  const authState = useSelector((state) => state);
  console.log("state", authState);
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return <div>{isAuthenticated ? <LogoutButton /> : <LoginButton />}</div>;
}

export default UserButton;
