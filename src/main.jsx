import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App.jsx";
import "./index.css";
import { authConfig } from "../auth0-config.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={authConfig.domain}
      clientId={authConfig.clientId}
      authorizationParams={{ redirect_uri: authConfig.redirectUri }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  </StrictMode>
);
