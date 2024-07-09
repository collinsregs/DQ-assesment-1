import { useEffect } from "react"; // Use useEffect for navigation
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

function SendUser(user) {
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const sendUserData = async () => {
      try {
        console.log("user:", user);
        const response = await axios.post("/user", user);
        console.log("response", response);

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

    sendUserData();
  }, [user]); // Run useEffect only when user object changes

  // Return JSX for your component
}

export default SendUser;
