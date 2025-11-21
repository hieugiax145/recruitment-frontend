import { useAuth } from '../context/AuthContext';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from '../constants/permissions';

/**
 * Custom hook for checking user permissions
 * @returns {Object} Permission checking functions
 */
export const usePermission = () => {
  const { user } = useAuth();

  const userPermissions = user?.role?.permissions || [];

  /**
   * Check if user has a specific permission
   * @param {string} permission - The permission name to check
   * @returns {boolean}
   */
  const can = (permission) => {
    return hasPermission(userPermissions, permission);
  };

  /**
   * Check if user has any of the specified permissions
   * @param {string[]} permissions - Array of permission names
   * @returns {boolean}
   */
  const canAny = (permissions) => {
    return hasAnyPermission(userPermissions, permissions);
  };

  /**
   * Check if user has all of the specified permissions
   * @param {string[]} permissions - Array of permission names
   * @returns {boolean}
   */
  const canAll = (permissions) => {
    return hasAllPermissions(userPermissions, permissions);
  };

  return {
    can,
    canAny,
    canAll,
    permissions: userPermissions,
  };
};
