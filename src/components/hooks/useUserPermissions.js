import { useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";

/**
 * Simplified permissions hook without database dependencies
 * For now, all authenticated users have full access
 */
export default function useUserPermissions() {
  const { user, isAuthenticated } = useAuth0();
  
  // For simplified flow, all authenticated users are treated as admins
  const userRole = isAuthenticated ? 'admin' : null;
  const isAdmin = isAuthenticated;
  const isUser = isAuthenticated;

  // Feature permissions based on role
  const permissions = useMemo(() => ({
    // Route permissions
    routes: {
      viewAll: isAdmin, // Only admins can view all org routes
      viewAssigned: isUser, // Users can view their assigned routes
      create: isAdmin, // Only admins can create routes
      edit: isAdmin, // Only admins can edit routes
      delete: isAdmin, // Only admins can delete routes
      assign: isAdmin, // Only admins can assign routes to users
      updateProgress: isUser, // Users can update progress on assigned routes
      bulkOperations: isAdmin, // Bulk route operations
    },

    // Client permissions
    clients: {
      viewAll: isAdmin, // Admins can view all org clients
      viewAssigned: isUser, // Users can view clients on their assigned routes
      create: isAdmin, // Only admins can create clients
      edit: isAdmin, // Only admins can edit client details
      updateStatus: isUser, // Users can update client status during route execution
      delete: isAdmin, // Only admins can delete clients
      bulkOperations: isAdmin, // Bulk client operations
    },

    // Assignment permissions (routes assigned to users)
    assignments: {
      viewAll: isAdmin, // Admins can view all assignments
      viewOwn: isUser, // Users can see their own assignments
      create: isAdmin, // Only admins can create assignments
      edit: isAdmin, // Only admins can modify assignments
      delete: isAdmin, // Only admins can delete assignments
      manage: isAdmin, // Only admins can manage assignments
    },

    // Analytics permissions
    analytics: {
      viewOrgWide: isAdmin, // Only admins see organization-wide analytics
      viewOwn: isUser, // Users can see their own performance analytics
      exportData: isAdmin, // Only admins can export data
      viewReports: isAdmin, // Only admins can view reports
      createReports: isAdmin, // Only admins can create reports
    },

    // Organization management
    organization: {
      view: isAdmin, // Only admins can view org settings
      edit: isAdmin,
      manageUsers: isAdmin,
      viewUsers: isAdmin,
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
      viewAll: isAdmin, // Only admins can view all notifications
      send: isAdmin, // Only admins can send notifications to others
      manage: isAdmin, // Only admins can manage notification settings
    },

    // General UI permissions
    ui: {
      showAdvancedFeatures: isAdmin,
      showBulkActions: isAdmin,
      showAdminMenu: isAdmin,
      showUserOnlyFeatures: isUser,
    }
  }), [userRole, isAdmin, isUser]);

  // Helper functions for common permission checks
  const can = useMemo(() => ({
    // Route helpers
    viewRoute: (route) => {
      if (permissions.routes.viewAll) return true;
      // Users can view routes assigned to them
      return route?.assigned_user_id === user?.sub;
    },
    
    editRoute: (route) => {
      // Only admins can edit routes
      return permissions.routes.edit;
    },
    
    deleteRoute: (route) => {
      // Only admins can delete routes
      return permissions.routes.delete;
    },

    updateRouteProgress: (route) => {
      // Users can update progress on routes assigned to them
      return route?.assigned_user_id === user?.sub && permissions.routes.updateProgress;
    },

    // Client helpers
    viewClient: (client) => {
      if (permissions.clients.viewAll) return true;
      // Users can view clients on their assigned routes (this would need route context)
      return false; // Will be enhanced when we add route context
    },
    
    editClient: (client) => {
      // Only admins can edit client details
      return permissions.clients.edit;
    },
    
    updateClientStatus: (client) => {
      // Users can update client status during route execution
      return permissions.clients.updateStatus;
    },
    
    deleteClient: (client) => {
      // Only admins can delete clients
      return permissions.clients.delete;
    },

    // Assignment helpers
    viewAssignment: (assignment) => {
      if (permissions.assignments.viewAll) return true;
      // Users can view their own assignments
      return assignment?.assigned_user_id === user?.sub;
    },

    // Page access helpers
    accessPage: (page) => {
      switch (page) {
        case 'routes':
          return true; // All users can access routes page
        case 'clients':
          return true; // All users can access clients page
        case 'drivers':
          return permissions.users.view; // Only admins can manage drivers (users with 'user' role)
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
  }), [permissions, user]);

  // Data scoping helpers
  const getDataScope = useMemo(() => ({
    // Returns the appropriate filter for database queries
    routes: () => {
      // For simplified flow, return empty filters (all routes)
      return {};
    },

    clients: () => {
      // For simplified flow, return empty filters (all clients)
      return {};
    },

    assignments: () => {
      // For simplified flow, return empty filters (all assignments)
      return {};
    }
  }), [permissions, user]);

  return {
    // User info
    userRole,
    userRecord: user, // Use Auth0 user object directly
    isAdmin,
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