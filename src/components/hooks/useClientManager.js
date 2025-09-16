import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getSupabaseClient } from "./useSupabaseClient";
import { useToast } from "../../contexts/ToastContext";
import useUserPermissions from "./useUserPermissions";
import useUserCreation from "./useUserCreation";

export default function useClientManager() {
  const { user, getIdTokenClaims } = useAuth0();
  const { showError } = useToast();
  const { can, getDataScope, permissions } = useUserPermissions();
  const { userRecord } = useUserCreation();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Use userRecord.organization_id directly instead of fetching

  // Fetch clients on mount
  useEffect(() => {
    if (user && user.sub && userRecord) {
      fetchClients();
    }
  }, [user?.sub, userRecord]);

  /**
   * Fetch all clients for the current user's organization
   */
  const fetchClients = async () => {
    if (!user || !userRecord) {
      setError("User is not authenticated or not set up");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tokenClaims = await getIdTokenClaims();
      if (!tokenClaims || !tokenClaims.__raw) {
        throw new Error("Unable to get authentication token");
      }

      const supabase = getSupabaseClient(tokenClaims.__raw);

      // Get data scope based on user role - ensure organization filtering
      const dataScope = getDataScope.clients();
      
      let query = supabase
        .from('clients')
        .select('*')
        .eq('organization_id', userRecord.organization_id);
      
      // Apply additional role-based filtering
      Object.entries(dataScope).forEach(([key, value]) => {
        if (key !== 'organization_id') { // Skip org filter since we already added it
          query = query.eq(key, value);
        }
      });
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        setError(error.message);
        setClients([]);
      } else {
        setClients(data || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching clients:', err);
      setError(err.message || "Failed to load clients");
      setClients([]);
    }

    setLoading(false);
  };

  /**
   * Create a new client
   */
  const handleCreateClient = async (clientData) => {
    if (!user || !userRecord) {
      throw new Error("User is not authenticated or not set up");
    }

    try {
      const tokenClaims = await getIdTokenClaims();
      if (!tokenClaims || !tokenClaims.__raw) {
        throw new Error("Unable to get authentication token");
      }

      const supabase = getSupabaseClient(tokenClaims.__raw);

      const clientPayload = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        organization_id: userRecord.organization_id,
        created_by_user_id: userRecord.id,
        status: clientData.status || 'active',
        notes: clientData.notes || null,
      };

      const { data, error } = await supabase
        .from('clients')
        .insert([clientPayload])
        .select()
        .single();

      if (error) {
        console.error('Error creating client:', error);
        throw new Error(error.message);
      }

      // Add the new client to the local state
      setClients(prevClients => [data, ...prevClients]);
      return data;
    } catch (err) {
      console.error('Unexpected error creating client:', err);
      throw err;
    }
  };

  /**
   * Update an existing client
   */
  const handleUpdateClient = async (clientId, clientData) => {
    if (!user || !userRecord) {
      throw new Error("User is not authenticated or not set up");
    }

    try {
      const tokenClaims = await getIdTokenClaims();
      if (!tokenClaims || !tokenClaims.__raw) {
        throw new Error("Unable to get authentication token");
      }

      const supabase = getSupabaseClient(tokenClaims.__raw);

      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', clientId)
        .select()
        .single();

      if (error) {
        console.error('Error updating client:', error);
        throw new Error(error.message);
      }

      // Update the client in local state
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId ? data : client
        )
      );

      return data;
    } catch (err) {
      console.error('Unexpected error updating client:', err);
      throw err;
    }
  };

  /**
   * Delete a client
   */
  const handleDeleteClient = async (clientId) => {
    if (!user || !userRecord) {
      throw new Error("User is not authenticated or not set up");
    }

    // Find the client to check permissions
    const clientToDelete = clients.find(client => client.id === clientId);
    if (!clientToDelete) {
      throw new Error("Client not found");
    }

    // Check if user has permission to delete this client
    if (!can.deleteClient(clientToDelete)) {
      showError("You don't have permission to delete this client");
      throw new Error("Permission denied");
    }

    try {
      const tokenClaims = await getIdTokenClaims();
      if (!tokenClaims || !tokenClaims.__raw) {
        throw new Error("Unable to get authentication token");
      }

      const supabase = getSupabaseClient(tokenClaims.__raw);

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) {
        console.error('Error deleting client:', error);
        throw new Error(error.message);
      }

      // Remove the client from local state
      setClients(prevClients => 
        prevClients.filter(client => client.id !== clientId)
      );
    } catch (err) {
      console.error('Unexpected error deleting client:', err);
      throw err;
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  return {
    // State
    clients: filteredClients,
    allClients: clients,
    loading,
    error,
    isEmpty: filteredClients.length === 0,
    searchTerm,
    
    // Actions
    fetchClients,
    createClient: handleCreateClient,
    updateClient: handleUpdateClient,
    deleteClient: handleDeleteClient,
    clearError,
    setSearchTerm,
    
    // Permission helpers
    canDeleteClient: can.deleteClient,
    canEditClient: can.editClient,
    canViewClient: can.viewClient,
    permissions
  };
}