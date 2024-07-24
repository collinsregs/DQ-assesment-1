import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { Auth0Provider } from "@auth0/auth0-react";
import store from "./app/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain="dev-n6ayoeyocngwbam1.us.auth0.com"
        clientId="JfwyOBzpGwRCjhJnrHKFkaGxACVbb2T9"
        authorizationParams={{
          redirect_uri: "http://localhost:3000/",
        }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
      >
        <App />
      </Auth0Provider>
    </Provider>
  </React.StrictMode>
);
