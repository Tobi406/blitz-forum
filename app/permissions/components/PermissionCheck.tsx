import useHasPermission from "app/auth/hooks/useHasPermission";
import { AuthorizationError } from "blitz";
import { Suspense } from "react";

const SecurityCheck = ({permission, children}: {permission: string, children: JSX.Element}) => {
  const result = useHasPermission(permission);

  if (!result) throw new AuthorizationError(`You do not have the permission ${permission}`);

  return children;
}

const PermissionCheck = ({
  permission,
  children,
}: {
  permission?: string,
  children: JSX.Element,
}) => {
  const hasPermission = typeof permission !== "undefined";

  if (!hasPermission) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback="Loading...">
      <SecurityCheck permission={permission!}>
        {children}
      </SecurityCheck>
    </Suspense>
  );
} 

export default PermissionCheck;
