import React, { ComponentProps, ComponentType } from "react";

import { useAuthStore } from "@/store/auth-store";
import { Permission, PermissionType } from "@/types/permissions";

import AccessDeniedPage from "./access-denied";

interface WithPermissionOptions {
  permissions: PermissionType[];
  isShowAccessDeniedPage?: boolean;
}

// HOC that wraps components with permission checking
export function withPermission<
  C extends ComponentType,
  Props extends ComponentProps<C>
>(Component: ComponentType<Props>, options: WithPermissionOptions) {
  const { permissions: requiredPermissions, isShowAccessDeniedPage = true } =
    options;

  const WithPermissionComponent: React.FC<Props> = (props) => {
    const { user, isAuthenticated } = useAuthStore();

    // If not authenticated, return null or redirect to login
    if (!isAuthenticated || !user) {
      if (isShowAccessDeniedPage) {
        return <AccessDeniedPage />;
      }
      return null;
    }
    // Get user permissions (fallback to empty array if not available)
    const userPermissions = user.permissions || [];

    // Check if user has any of the required permissions
    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission as Permission)
    );

    // If user doesn't have permission and should show access denied page
    if (!hasPermission && isShowAccessDeniedPage) {
      return <AccessDeniedPage />;
    }

    // Pass permission info to the wrapped component
    return <Component {...props} />;
  };

  // Set display name for debugging
  WithPermissionComponent.displayName = `withPermission(${
    Component.displayName || Component.name || "Component"
  })`;

  return WithPermissionComponent;
}
