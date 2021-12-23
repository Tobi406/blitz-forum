import currentUserHasPermission from "app/permissions/queries/hasPermission";
import { useQuery } from "blitz";

const useHasPermission = (permission: string) => {
  const [permissionResult] = useQuery(currentUserHasPermission, {
    permissionName: permission,
  })
  return permissionResult;
};

export default useHasPermission;;
