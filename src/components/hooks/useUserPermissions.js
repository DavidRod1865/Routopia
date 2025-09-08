import { useMemo } from "react";
import useUserOnboarding from "./useUserOnboarding";

/**
 * Centralized hook for role-based permissions and access control
 * Provides consistent permission checking across the application
 */
export default function useUserPermissions() {
  const { userRecord } = useUserOnboarding();
  
  const userRole = userRecord?.role;
  const isAdmin = userRole === 'admin';
  const isManager = userRole === 'manager';
  const isUser = userRole === 'user';

  // Feature permissions based on role
  const permissions = useMemo(() => ({
    // Route permissions
    routes: {
      viewAll: isAdmin || isManager, // Can view all org routes
      viewOwn: true, // All users can view their own routes
      create: true, // All users can create routes
      edit: isAdmin || isManager, // Can edit any route in org
      editOwn: true, // All users can edit their own routes
      delete: isAdmin || isManager, // Can delete any route in org
      deleteOwn: isUser, // Users can only delete their own routes
      assign: isAdmin || isManager, // Can assign routes to drivers
      bulkOperations: isAdmin || isManager, // Bulk route operations
    },

    // Client permissions
    clients: {
      viewAll: isAdmin || isManager, // Can view all org clients
      viewOwn: true, // All users can view their own clients
      create: true, // All users can create clients
      edit: isAdmin || isManager, // Can edit any client in org
      editOwn: true, // All users can edit their own clients
      delete: isAdmin || isManager, // Can delete any client in org
      deleteOwn: isUser, // Users can only delete their own clients
      bulkOperations: isAdmin || isManager, // Bulk client operations
    },

    // Driver permissions
    drivers: {
      view: isAdmin || isManager, // Only admin/managers can see drivers
      create: isAdmin || isManager,
      edit: isAdmin || isManager,
      delete: isAdmin,
      assign: isAdmin || isManager,
      bulkOperations: isAdmin,
    },

    // Assignment permissions
    assignments: {
      viewAll: isAdmin || isManager, // Can view all assignments
      viewOwn: isUser, // Users can only see their own assignments
      create: isAdmin || isManager,
      edit: isAdmin || isManager,
      delete: isAdmin,
      manage: isAdmin || isManager,
    },

    // Analytics permissions
    analytics: {
      viewOrgWide: isAdmin || isManager, // Organization-wide analytics
      viewOwn: isUser, // Users can see their own analytics
      exportData: isAdmin || isManager,
      viewReports: isAdmin || isManager,
      createReports: isAdmin,
    },

    // Organization management
    organization: {
      view: isAdmin, // Only admins can view org settings
      edit: isAdmin,
      manageUsers: isAdmin,
      viewUsers: isAdmin || isManager,
      manageBilling: isAdmin,
      viewAuditLogs: isAdmin,
    },

    // User management
    users: {
      view: isAdmin, // Only admins can manage users
      invite: isAdmin,
      edit: isAdmin,
      delete: isAdmin,
      changeRoles: isAdmin,
    },

    // Notification permissions
    notifications: {
      viewOwn: true, // All users can view their notifications
      viewAll: isAdmin || isManager, // Managers can view team notifications
      send: isAdmin || isManager, // Can send notifications to others
      manage: isAdmin, // Can manage notification settings
    },

    // General UI permissions
    ui: {
      showAdvancedFeatures: isAdmin || isManager,
      showBulkActions: isAdmin || isManager,
      showAdminMenu: isAdmin,
      showManagerFeatures: isAdmin || isManager,
      showUserOnlyFeatures: isUser,
    }
  }), [userRole, isAdmin, isManager, isUser]);

  // Helper functions for common permission checks
  const can = useMemo(() => ({
    // Route helpers
    viewRoute: (route) => {
      if (permissions.routes.viewAll) return true;
      return route?.user_id === userRecord?.auth0_id;
    },
    
    editRoute: (route) => {
      if (permissions.routes.edit) return true;
      return route?.user_id === userRecord?.auth0_id && permissions.routes.editOwn;
    },
    
    deleteRoute: (route) => {
      if (permissions.routes.delete) return true;
      return route?.user_id === userRecord?.auth0_id && permissions.routes.deleteOwn;
    },

    // Client helpers
    viewClient: (client) => {
      if (permissions.clients.viewAll) return true;
      return client?.created_by_user_id === userRecord?.auth0_id;
    },
    
    editClient: (client) => {
      if (permissions.clients.edit) return true;
      return client?.created_by_user_id === userRecord?.auth0_id && permissions.clients.editOwn;
    },
    
    deleteClient: (client) => {
      if (permissions.clients.delete) return true;
      return client?.created_by_user_id === userRecord?.auth0_id && permissions.clients.deleteOwn;
    },

    // Page access helpers
    accessPage: (page) => {
      switch (page) {
        case 'routes':
          return true; // All users can access routes page
        case 'clients':
          return true; // All users can access clients page
        case 'drivers':
          return permissions.drivers.view;
        case 'assignments':
          return permissions.assignments.viewAll || permissions.assignments.viewOwn;
        case 'analytics':
          return permissions.analytics.viewOrgWide || permissions.analytics.viewOwn;
        case 'organization':
          return permissions.organization.view;
        case 'users':
          return permissions.users.view;
        default:
          return false;
      }
    }
  }), [permissions, userRecord]);

  // Data scoping helpers
  const getDataScope = useMemo(() => ({
    // Returns the appropriate filter for database queries
    routes: () => {
      if (permissions.routes.viewAll) {
        // Admin/Manager: return all routes in organization
        return { organization_id: userRecord?.organization_id };
      } else {
        // User: return only their own routes
        return { 
          organization_id: userRecord?.organization_id,
          user_id: userRecord?.auth0_id 
        };
      }
    },

    clients: () => {
      if (permissions.clients.viewAll) {
        // Admin/Manager: return all clients in organization
        return { organization_id: userRecord?.organization_id };
      } else {
        // User: return only their own clients
        return { 
          organization_id: userRecord?.organization_id,
          created_by_user_id: userRecord?.auth0_id 
        };
      }
    },

    assignments: () => {
      if (permissions.assignments.viewAll) {
        // Admin/Manager: return all assignments in organization
        return { organization_id: userRecord?.organization_id };
      } else {
        // User: return only assignments for their routes
        return { 
          organization_id: userRecord?.organization_id,
          // This would need a join or subquery to match user's routes
          user_id: userRecord?.auth0_id 
        };
      }
    }
  }), [permissions, userRecord]);

  return {
    // User info
    userRole,
    userRecord,
    isAdmin,
    isManager,
    isUser,
    
    // Permissions object
    permissions,
    
    // Helper functions
    can,
    
    // Data scoping
    getDataScope,
    
    // Quick checks
    hasPermission: (permission) => {
      const keys = permission.split('.');
      let current = permissions;
      for (const key of keys) {
        if (current[key] === undefined) return false;
        current = current[key];
      }
      return current === true;
    }
  };
}