import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import useClientManager from "./hooks/useClientManager";

const ClientSelector = ({ 
  onClientSelect, 
  placeholder = "Search for a client...",
  selectedClient = null,
  error = null,
  disabled = false 
}) => {
  const { clients, loading } = useClientManager();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filter clients based on search term
  useEffect(() => {
    if (!clients || clients.length === 0) {
      setFilteredClients([]);
      return;
    }

    const filtered = clients.filter(client => 
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredClients(filtered);
  }, [clients, searchTerm]);

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Handle input blur (with delay to allow for clicks)
  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  // Handle client selection
  const handleClientClick = (client) => {
    setSearchTerm(client.name);
    setIsOpen(false);
    onClientSelect(client);
  };

  // Handle clear selection
  const handleClear = () => {
    setSearchTerm("");
    setIsOpen(false);
    onClientSelect(null);
  };

  // Set initial search term if selectedClient exists
  useEffect(() => {
    if (selectedClient) {
      setSearchTerm(selectedClient.name);
    }
  }, [selectedClient]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-3 py-2 pr-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        />
        
        {/* Clear button */}
        {searchTerm && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div 
          ref={dropdownRef}
          className="absolute z-[10000] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {loading ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              Loading clients...
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 text-center">
              {searchTerm ? 'No clients found' : 'No clients available'}
            </div>
          ) : (
            filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => handleClientClick(client)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900">{client.name}</div>
                <div className="text-sm text-gray-600 truncate">{client.address}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

ClientSelector.propTypes = {
  onClientSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  selectedClient: PropTypes.object,
  error: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ClientSelector;