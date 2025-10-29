import { useAuthStore } from "@/store/auth-store";
import { Permission, PermissionType } from "@/types/permissions";

// Hook for checking permissions in functional components
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuthStore();

  const hasPermission = (requiredPermissions: PermissionType[]): boolean => {
    if (!isAuthenticated || !user || !user.permissions) {
      return false;
    }

    return requiredPermissions.some((permission) =>
      user.permissions!.includes(permission as Permission)
    );
  };

  const hasAllPermissions = (
    requiredPermissions: PermissionType[]
  ): boolean => {
    if (!isAuthenticated || !user || !user.permissions) {
      return false;
    }

    return requiredPermissions.every((permission) =>
      user.permissions!.includes(permission as Permission)
    );
  };

  return {
    userPermissions: user?.permissions || [],
    hasPermission,
    hasAllPermissions,
    isAuthenticated,
  };
};
