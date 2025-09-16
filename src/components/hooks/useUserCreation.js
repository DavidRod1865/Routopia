import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getSupabaseClient, getServiceSupabaseClient } from "./useSupabaseClient";
import { useToast } from "../../contexts/ToastContext";

/**
 * Simplified hook to automatically create users in database when they log in
 * Ensures every authenticated user has a record in the users table
 */
export default function useUserCreation() {
  const { user, getIdTokenClaims, isAuthenticated, isLoading } = useAuth0();
  const { showError, showSuccess } = useToast();
  const [userRecord, setUserRecord] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only run once when user is authenticated and loaded
    if (!isAuthenticated || isLoading || !user?.sub || userRecord || isCreating) {
      return;
    }

    const initializeUser = async () => {
      try {
        setIsCreating(true);
        setError(null);

        const tokenClaims = await getIdTokenClaims();
        if (!tokenClaims?.__raw) {
          return;
        }

        const supabase = getSupabaseClient(tokenClaims.__raw);

        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('auth0_id', user.sub)
          .single();

        if (existingUser) {
          setUserRecord(existingUser);
          return;
        }

        // User doesn't exist, create them
        if (fetchError?.code === 'PGRST116') {
          await createUser(supabase);
        } else if (fetchError) {
          throw new Error(`Database error: ${fetchError.message}`);
        }

      } catch (err) {
        setError(err.message);
        showError(`User setup failed: ${err.message}`);
      } finally {
        setIsCreating(false);
      }
    };

    initializeUser();
  }, [isAuthenticated, isLoading, user?.sub, userRecord, isCreating]);

  const createUser = async (supabase) => {
    try {
      // Create default organization first using service role for admin operations
      let organizationId;
      
      // Use service role key for organization operations to bypass RLS
      const serviceSupabase = getServiceSupabaseClient();
      
      const { data: existingOrg } = await serviceSupabase
        .from('organizations')
        .select('id')
        .eq('name', 'Default Organization')
        .single();

      if (existingOrg) {
        organizationId = existingOrg.id;
      } else {
        const { data: newOrg, error: orgError } = await serviceSupabase
          .from('organizations')
          .insert([{ name: 'Default Organization' }])
          .select()
          .single();

        if (orgError) throw new Error(`Organization creation failed: ${orgError.message}`);
        organizationId = newOrg.id;
      }

      // Create user
      const userData = {
        auth0_id: user.sub,
        email: user.email,
        name: user.name || user.email,
        role: 'admin',
        organization_id: organizationId,
        is_onboarded: true
      };

      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (userError) throw new Error(`User creation failed: ${userError.message}`);

      setUserRecord(newUser);
      showSuccess('Welcome! Your account has been set up.');

    } catch (err) {
      throw new Error(`User creation failed: ${err.message}`);
    }
  };

  return {
    userRecord,
    isCreating,
    error
  };
}