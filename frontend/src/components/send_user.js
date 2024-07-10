import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { setAuth } from "../app/actions";

function SendUser(user) {
  const dispatch = useDispatch();
  const isAuthenticated = user.isAuthenticated;

  console.log("user at user management:", user);
  console.log("isAuthenticated at user management:", isAuthenticated);
  useEffect(() => {
    const sendUserData = async () => {
      try {
        const response = await axios.post("/user", user);

        if (response.status === 200) {
          //   navigate("/"); // Redirect to "/" on successful response
        } else {
          console.error("Error sending user data:", response);
          // Handle unsuccessful response (optional)
        }
      } catch (error) {
        console.error("Error sending user data:", error);
        // Handle errors during the request (optional)
      }
    };
    dispatch(setAuth(isAuthenticated, user));

    sendUserData();
  }, [user, isAuthenticated, dispatch]); // Run useEffect only when user object changes

  // Return JSX for your component
}

export default SendUser;
