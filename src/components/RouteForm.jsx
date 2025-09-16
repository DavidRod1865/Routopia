import { useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import ClientSelector from "./ClientSelector";

const RouteForm = ({ onSave, onClose }) => {
  const [routeName, setRouteName] = useState("");
  const [selectedClients, setSelectedClients] = useState([null]);
  const [addresses, setAddresses] = useState([""]);

  const handleAddAddress = () => {
    setSelectedClients([...selectedClients, null]);
    setAddresses([...addresses, ""]);
  };

  const handleClientSelect = (index, client) => {
    const newSelectedClients = [...selectedClients];
    const newAddresses = [...addresses];
    
    newSelectedClients[index] = client;
    newAddresses[index] = client ? client.address : "";
    
    setSelectedClients(newSelectedClients);
    setAddresses(newAddresses);
  };

  const handleRemoveAddress = (index) => {
    if (selectedClients.length > 1) {
      const newSelectedClients = selectedClients.filter((_, i) => i !== index);
      const newAddresses = addresses.filter((_, i) => i !== index);
      
      setSelectedClients(newSelectedClients);
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
    setSelectedClients([null]);
    setAddresses([""]);
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Add a New Route</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium">Route Name</label>
            <input
              type="text"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Work Commute"
              required
            />
          </div>

          {selectedClients.map((client, index) => (
            <div key={index} className="space-y-3 pb-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">
                  Client {index + 1}
                </label>
                {selectedClients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAddress(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              {!client ? (
                <div className="mb-4">
                  <ClientSelector
                    onClientSelect={(selectedClient) => handleClientSelect(index, selectedClient)}
                    selectedClient={client}
                    placeholder={`Search for client ${index + 1}...`}
                  />
                </div>
              ) : (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border relative">
                  <button
                    type="button"
                    onClick={() => handleClientSelect(index, null)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg"
                  >
                    ×
                  </button>
                  <div className="font-medium text-gray-900 pr-6">{client.name}</div>
                  <div className="text-gray-600 pr-6">{client.address}</div>
                </div>
              )}
            </div>
          ))}

          <div className="pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleAddAddress}
              className="text-blue-500 hover:underline text-sm font-medium"
            >
              + Add Another Client
            </button>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 font-medium"
            >
              Save Route
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

RouteForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RouteForm;
