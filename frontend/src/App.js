import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import "./App.css";
import FileUpload from "./components/file_uploader";
import DualDocumentViewer from "./components/file_view";
import Nav from "./components/nav_drawer";
import SendUser from "./components/send_user";

function App() {
  const {
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();

  const token = isAuthenticated ? getAccessTokenSilently() : null;
  console.log("token from gettoken", token);

  return (
    <Router>
      <div className="App">
        <div className="main">
          <div className="nav">
            <Nav />
          </div>
          <div className="content-block-2">
            <Routes>
              {/* <Route path="/user" element={<SendUser />} /> */}
              <Route path="/" element={<FileUpload />} />
              <Route path="/documents/:id" element={<DualDocumentViewer />} />
            </Routes>
            <SendUser user={user} isAuthenticated={isAuthenticated} />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
