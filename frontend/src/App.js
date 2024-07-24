import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import "./App.css";
import FileUpload from "./components/file_uploader";
import DualDocumentViewer from "./components/file_view";
import Nav from "./components/nav_drawer";
import SendUser from "./components/send_user";
import NavMobile from "./components/drawer_mobile";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiSvgIcon: {
      root: {
        height: "2rem",
        width: "2rem",
        color: "var(--color-light)",
      },
    },
  },
});
function App() {
  const { isAuthenticated, user } = useAuth0();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <div className="main">
            <NavMobile />
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
    </ThemeProvider>
  );
}

export default App;
