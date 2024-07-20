import { useSelector } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./login_button";
import LogoutButton from "./logout_button";

function UserButton(prop) {
  const { isListOpen } = prop;
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return (
    <div>
      {isAuthenticated ? (
        <LogoutButton isListOpen={isListOpen} />
      ) : (
        <LoginButton isListOpen={isListOpen} />
      )}
    </div>
  );
}

export default UserButton;
