import { LoadScript } from "@react-google-maps/api";
import PropTypes from "prop-types";

const libraries = ["places"]; // Include required libraries

const GoogleMapsProvider = ({ children }) => {
  return (
    <LoadScript 
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} 
      libraries={libraries}
      loadingElement={<div>Loading Google Maps...</div>}
      onError={(error) => {
        console.error("Google Maps loading error:", error);
      }}
    >
      {children}
    </LoadScript>
  );
};

GoogleMapsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GoogleMapsProvider;
