import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./login_button";
import LogoutButton from "./logout_button";

function UserButton(prop) {
  const { isListOpen } = prop;
  const { isAuthenticated } = useAuth0();
  // conditional rendering of login and logout dependent on user authentication state
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
