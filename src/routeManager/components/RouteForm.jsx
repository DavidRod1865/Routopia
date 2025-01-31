import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Autocomplete } from "@react-google-maps/api";

const RouteForm = ({ onSave }) => {
  const [routeName, setRouteName] = useState("");
  const [addresses, setAddresses] = useState([""]);
  const autocompleteRefs = useRef([]);

  const handleAddAddress = () => {
    setAddresses([...addresses, ""]);
  };

  const handleAddressChange = (index, value) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value;
    setAddresses(newAddresses);
  };

  const handlePlaceSelected = (index) => {
    const place = autocompleteRefs.current[index]?.getPlace();
    if (place) {
      const newAddresses = [...addresses];
      newAddresses[index] = place.formatted_address || place.name;
      setAddresses(newAddresses);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!routeName || addresses.some((address) => address.trim() === "")) {
      alert("Please provide a route name and complete all addresses.");
      return;
    }
    onSave(routeName, addresses);

    setRouteName("");
    setAddresses([""]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 bg-white shadow-lg rounded-lg space-y-4 mb-4"
    >
      <h2 className="text-xl font-bold">Add a New Route</h2>

      <div>
        <label className="block text-sm font-medium">Route Name</label>
        <input
          type="text"
          value={routeName}
          onChange={(e) => setRouteName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                     focus:border-blue-500 focus:ring-blue-500"
          placeholder="e.g., Work Commute"
          required
        />
      </div>

      {addresses.map((address, index) => (
        <div key={index} className="w-full mb-2">
          <Autocomplete
            onLoad={(autocomplete) =>
              (autocompleteRefs.current[index] = autocomplete)
            }
            onPlaceChanged={() => handlePlaceSelected(index)}
          >
            <input
              type="text"
              value={address}
              onChange={(e) => handleAddressChange(index, e.target.value)}
              className="w-full mt-1 block rounded-md border-gray-300 shadow-sm
                         focus:border-blue-500 focus:ring-blue-500"
              placeholder={`Address ${index + 1}`}
              required
            />
          </Autocomplete>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddAddress}
        className="text-blue-500 hover:underline"
      >
        + Add Another Address
      </button>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
      >
        Save Route
      </button>
    </form>
  );
};

RouteForm.propTypes = {
  onSave: PropTypes.func.isRequired,
};

export default RouteForm;
