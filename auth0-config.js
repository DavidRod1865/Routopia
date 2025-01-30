export const authConfig = {
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT,
    redirectUri: "http://localhost:5173/dashboard",
  };
  