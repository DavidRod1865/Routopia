import { useAuth0 } from "@auth0/auth0-react";

const AuthButtons = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <div>
      {isAuthenticated ? (
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          className="block p-2 ml-3 text-white bg-red-700 rounded md:m-0 "
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => loginWithRedirect()}
          className="block my-2 py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:m-0 "
        >
          Login
        </button>
      )}
    </div>
  );
};

export default AuthButtons;
