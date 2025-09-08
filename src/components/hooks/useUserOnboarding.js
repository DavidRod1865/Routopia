import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getSupabaseClient } from "./useSupabaseClient";
import { useToast } from "../../contexts/ToastContext";

export default function useUserOnboarding() {
  const { user, getIdTokenClaims, isLoading: authLoading } = useAuth0();
  const { showError, showSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [userRecord, setUserRecord] = useState(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [error, setError] = useState(null);

  // Check if user exists in database and has required fields
  useEffect(() => {
    if (authLoading || !user?.sub) {
      setIsLoading(authLoading);
      return;
    }

    checkUserStatus();
  }, [user?.sub, authLoading]);

  const checkUserStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const tokenClaims = await getIdTokenClaims();
      if (!tokenClaims || !tokenClaims.__raw) {
        throw new Error("Unable to get authentication token");
      }

      const supabase = getSupabaseClient(tokenClaims.__raw);
      
      // Check if user exists in database
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('auth0_id', user.sub)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = no rows returned (user doesn't exist)
        throw new Error(`Database error: ${fetchError.message}`);
      }

      if (!existingUser) {
        // User doesn't exist in database - needs full onboarding
        setUserRecord(null);
        setNeedsOnboarding(true);
      } else if (!existingUser.role || !existingUser.organization_id) {
        // User exists but missing required fields - needs partial onboarding
        setUserRecord(existingUser);
        setNeedsOnboarding(true);
      } else {
        // User is fully set up
        setUserRecord(existingUser);
        setNeedsOnboarding(false);
      }
    } catch (err) {
      console.error('Error checking user status:', err);
      setError(err.message);
      showError("Failed to check user setup status");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a new user record in the database
   */
  const createUserRecord = async (userData) => {
    try {
      const tokenClaims = await getIdTokenClaims();
      if (!tokenClaims || !tokenClaims.__raw) {
        throw new Error("Unable to get authentication token");
      }

      const supabase = getSupabaseClient(tokenClaims.__raw);

      const userPayload = {
        auth0_id: user.sub,
        email: user.email,
        name: user.name || userData.name,
        ...userData // Additional fields like role, organization_id
      };

      const { data, error } = await supabase
        .from('users')
        .insert([userPayload])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setUserRecord(data);
      return data;
    } catch (err) {
      console.error('Error creating user record:', err);
      showError("Failed to create user profile");
      throw err;
    }
  };

  /**
   * Update existing user record
   */
  const updateUserRecord = async (userData) => {
    try {
      if (!userRecord) {
        throw new Error("No existing user record to update");
      }

      const tokenClaims = await getIdTokenClaims();
      if (!tokenClaims || !tokenClaims.__raw) {
        throw new Error("Unable to get authentication token");
      }

      const supabase = getSupabaseClient(tokenClaims.__raw);

      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('auth0_id', user.sub)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setUserRecord(data);
      return data;
    } catch (err) {
      console.error('Error updating user record:', err);
      showError("Failed to update user profile");
      throw err;
    }
  };

  /**
   * Create a new organization
   */
  const createOrganization = async (organizationName) => {
    try {
      const tokenClaims = await getIdTokenClaims();
      if (!tokenClaims || !tokenClaims.__raw) {
        throw new Error("Unable to get authentication token");
      }

      const supabase = getSupabaseClient(tokenClaims.__raw);

      const { data, error } = await supabase
        .from('organizations')
        .insert([{
          name: organizationName,
          admin_user_id: user.sub
        }])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err) {
      console.error('Error creating organization:', err);
      showError("Failed to create organization");
      throw err;
    }
  };

  /**
   * Verify if an organization exists by name
   */
  const verifyOrganization = async (organizationName) => {
    try {
      const tokenClaims = await getIdTokenClaims();
      if (!tokenClaims || !tokenClaims.__raw) {
        throw new Error("Unable to get authentication token");
      }

      const supabase = getSupabaseClient(tokenClaims.__raw);

      const { data, error } = await supabase
        .from('organizations')
        .select('id, name')
        .ilike('name', organizationName) // Case-insensitive exact match
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(error.message);
      }

      return data || null; // Returns organization data if found, null if not found
    } catch (err) {
      console.error('Error verifying organization:', err);
      throw err;
    }
  };

  /**
   * Complete onboarding by creating/updating user with all required fields
   */
  const completeOnboarding = async (onboardingData) => {
    try {
      const { role, organizationName, createNewOrganization } = onboardingData;
      
      let finalOrganizationId;

      if (createNewOrganization) {
        // Create new organization
        const newOrg = await createOrganization(organizationName);
        finalOrganizationId = newOrg.id;
      } else {
        // Verify existing organization
        const existingOrg = await verifyOrganization(organizationName);
        if (!existingOrg) {
          throw new Error(`Organization "${organizationName}" not found. Please check the name or create a new organization.`);
        }
        finalOrganizationId = existingOrg.id;
      }

      const userData = {
        role,
        organization_id: finalOrganizationId
      };

      let updatedUser;
      if (userRecord) {
        // Update existing user
        updatedUser = await updateUserRecord(userData);
      } else {
        // Create new user
        updatedUser = await createUserRecord(userData);
      }

      // Check onboarding status again
      setNeedsOnboarding(false);
      showSuccess("Welcome! Your account is now set up.");
      
      return updatedUser;
    } catch (err) {
      console.error('Error completing onboarding:', err);
      showError(err.message);
      throw err;
    }
  };

  return {
    // State
    isLoading,
    userRecord,
    needsOnboarding,
    error,
    
    // Actions
    checkUserStatus,
    createUserRecord,
    updateUserRecord,
    createOrganization,
    verifyOrganization,
    completeOnboarding,
  };
}