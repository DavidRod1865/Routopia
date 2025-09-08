import PropTypes from "prop-types";
import AuthButtons from "../auth_components/AuthButtons";

const Header = ({ user, sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden block p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          {/* Hamburger Icon */}
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold text-black">
          routopia<span className="text-green-600">+</span>
        </h1>
      </div>

      <div>
        {user ? (
          <div className="flex items-center space-x-2">
            <img
              src={user.picture}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-semibold">{user.name}</span>
            <AuthButtons />
          </div>
        ) : (
          <p className="italic text-gray-600">Not logged in</p>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  user: PropTypes.object,
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
};

export default Header;
