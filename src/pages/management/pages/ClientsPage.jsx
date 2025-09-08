import { useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import useClientManager from "../../../components/hooks/useClientManager";
import AddressAutocomplete from "../../../components/AddressAutocomplete";

// Client Form Modal Component - Extracted to prevent re-rendering issues
const ClientFormModal = ({
  editingClient,
  formData,
  formErrors,
  isSubmitting,
  onInputChange,
  onSubmit,
  onClose,
}) => {
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">
            {editingClient ? 'Edit Client' : 'Add New Client'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-4 space-y-4">
          {formErrors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{formErrors.submit}</p>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter client name"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => onInputChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formErrors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter phone number"
            />
            {formErrors.phone && (
              <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <AddressAutocomplete
              value={formData.address}
              onChange={(value) => onInputChange('address', value)}
              placeholder="Enter address"
              required
              error={formErrors.address}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (editingClient ? 'Update Client' : 'Add Client')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

ClientFormModal.propTypes = {
  editingClient: PropTypes.object,
  formData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
  formErrors: PropTypes.object.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

// Delete Confirmation Modal Component - Extracted to prevent re-rendering issues
const DeleteConfirmModal = ({ client, onConfirm, onCancel }) => {
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="text-red-500 text-2xl mr-3">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Client</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>{client.name}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

DeleteConfirmModal.propTypes = {
  client: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

const ClientsPage = () => {
  const {
    clients,
    loading,
    error,
    isEmpty,
    searchTerm,
    setSearchTerm,
    createClient,
    updateClient,
    deleteClient,
    clearError,
  } = useClientManager();

  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    }
    
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (editingClient) {
        await updateClient(editingClient.id, formData);
      } else {
        await createClient(formData);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error saving client:", err);
      setFormErrors({ submit: err.message || "Failed to save client" });
    }
    setIsSubmitting(false);
  };

  // Handle edit client
  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || "",
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
    });
    setShowModal(true);
  };

  // Handle delete client
  const handleDelete = async (clientId) => {
    try {
      await deleteClient(clientId);
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
    setFormErrors({});
    setIsSubmitting(false);
  };

  // Handle add new client
  const handleAddClient = () => {
    setEditingClient(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
    setFormErrors({});
    setShowModal(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading clients...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading clients</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={clearError} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <>
        <div className="h-full flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="text-6xl mb-6">🏠</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Manage Your Clients</h3>
            <p className="text-gray-600 mb-8">
              Keep track of all your clients, their contact information, service history, and preferences in one place.
            </p>
            <div className="space-y-4">
              <button 
                onClick={handleAddClient}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Client
              </button>
              <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Import from CSV
              </button>
            </div>
          </div>
        </div>
        
        {/* Client Form Modal */}
        {showModal && (
          <ClientFormModal
            editingClient={editingClient}
            formData={formData}
            formErrors={formErrors}
            isSubmitting={isSubmitting}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onClose={handleCloseModal}
          />
        )}
      </>
    );
  }

  // Main clients table view
  return (
    <>
      <div className="h-full bg-gray-50 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1">Manage your client database</p>
          </div>
          <button
            onClick={handleAddClient}
            className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>+</span>
            <span>Add Client</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Clients Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{client.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{client.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(client)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {clients.length} client{clients.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Client Form Modal */}
      {showModal && (
        <ClientFormModal
          editingClient={editingClient}
          formData={formData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={handleCloseModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal 
          client={showDeleteConfirm}
          onConfirm={() => handleDelete(showDeleteConfirm.id)}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </>
  );
};

ClientsPage.propTypes = {};

export default ClientsPage;