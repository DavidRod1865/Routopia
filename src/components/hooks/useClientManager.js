import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getSupabaseClient } from "./useSupabaseClient";
import { useToast } from "../../contexts/ToastContext";
import useUserPermissions from "./useUserPermissions";

export default function useClientManager() {
  const { user, getIdTokenClaims } = useAuth0();
  const { showError } = useToast();
  const { can, getDataScope, permissions } = useUserPermissions();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getOrganizationId = async (supabase) => {
    const { data, error } = await supabase
      .from('users')
      .select('organization_id')
      .eq('auth0_id', user.sub)
      .single();

    if (error) {
      console.error('Error fetching organization ID:', error);
      throw new Error(error.message);
    }
    return data.organization_id;
  };

  // Fetch clients on mount
  useEffect(() => {
    if (user && user.sub) {
      fetchClients();
    }
  }, [user?.sub]);

  /**
   * Fetch all clients for the current user's organization
   */
  const fetchClients = async () => {
    if (!user) {
      setError("User is not authenticated");
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

      // Get organization UUID from organizations table
      const organizationId = await getOrganizationId(supabase);

      // Get data scope based on user role
      const dataScope = getDataScope.clients();
      
      let query = supabase
        .from('clients')
        .select('*');
      
      // Apply role-based filtering
      Object.entries(dataScope).forEach(([key, value]) => {
        query = query.eq(key, value);
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
    if (!user) {
      throw new Error("User is not authenticated");
    }

    try {
      const tokenClaims = await getIdTokenClaims();
      if (!tokenClaims || !tokenClaims.__raw) {
        throw new Error("Unable to get authentication token");
      }

      const supabase = getSupabaseClient(tokenClaims.__raw);

      // Get organization UUID from organizations table
      const organizationId = await getOrganizationId(supabase);

      const clientPayload = {
        ...clientData,
        organization_id: organizationId,
        created_by_user_id: user.sub, // Track who created the client
        notification_preferences: {
          email: true,
          sms: false,
          push: true
        }
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
    if (!user) {
      throw new Error("User is not authenticated");
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
    if (!user) {
      throw new Error("User is not authenticated");
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
    clients: clients,
    loading,
    error,
    isEmpty: clients.length === 0,
    
    // Actions
    fetchClients,
    createClient: handleCreateClient,
    updateClient: handleUpdateClient,
    deleteClient: handleDeleteClient,
    clearError,
    
    // Permission helpers
    canDeleteClient: can.deleteClient,
    canEditClient: can.editClient,
    canViewClient: can.viewClient,
    permissions
  };
}