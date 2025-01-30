import { LoadScript } from "@react-google-maps/api";
import PropTypes from "prop-types";

const libraries = ["places"]; // Include required libraries

const GoogleMapsProvider = ({ children }) => {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      {children}
    </LoadScript>
  );
};

GoogleMapsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GoogleMapsProvider;
