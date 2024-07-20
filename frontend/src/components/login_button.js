import { useAuth0 } from "@auth0/auth0-react";
import LoginIcon from "@mui/icons-material/Login";
import Tooltip from "@mui/material/Tooltip";

const LoginButton = (prop) => {
  const { isListOpen } = prop;
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return (
    <Tooltip title="Login" arrow placement="right">
      <button onClick={() => loginWithRedirect()}>
        {isListOpen ? (
          <div className="profile-box">
            <LoginIcon />
            <div>Login</div>
          </div>
        ) : (
          <div className="profile-box">
            <LoginIcon />
          </div>
        )}
      </button>
    </Tooltip>
  );
};

export default LoginButton;
