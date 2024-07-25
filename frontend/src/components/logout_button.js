import { useAuth0 } from "@auth0/auth0-react";
import Tooltip from "@mui/material/Tooltip";
import LogoutIcon from "@mui/icons-material/Logout";

function LogoutButton(prop) {
  const { isListOpen } = prop;
  const { logout } = useAuth0();

  return (
    <Tooltip title="Logout" arrow placement="right">
      <button onClick={() => logout()}>
        {isListOpen ? (
          <div className="profile-box">
            <LogoutIcon />
            <div>Logout</div>
          </div>
        ) : (
          <div className="profile-box">
            <LogoutIcon />
          </div>
        )}
      </button>
    </Tooltip>
  );
}

export default LogoutButton;
