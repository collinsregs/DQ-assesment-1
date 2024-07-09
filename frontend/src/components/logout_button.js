import { useAuth0 } from "@auth0/auth0-react";

function LogoutButton() {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();

  return <button onClick={() => logout()}>Log Out</button>;
}

export default LogoutButton;
