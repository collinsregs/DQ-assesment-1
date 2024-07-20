import { useAuth0 } from "@auth0/auth0-react";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { Navigate, useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";

function LogoutButton(prop) {
  const { isListOpen } = prop;
  const navigate = useNavigate();

  function navigateProfile() {
    navigate("/profile");
  }

  return (
    <Tooltip title="View Profile" arrow placement="right">
      <button onClick={() => navigateProfile()}>
        {isListOpen ? (
          <div className="profile-box">
            <AccountBoxIcon />
            <div>Profile</div>
          </div>
        ) : (
          <div className="profile-box">
            <AccountBoxIcon />
          </div>
        )}
      </button>
    </Tooltip>
  );
}

export default LogoutButton;
