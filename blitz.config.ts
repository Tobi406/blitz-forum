import currentUserHasPermission from "app/permissions/queries/hasPermission";
import { BlitzConfig, sessionMiddleware, simpleRolesIsAuthorized } from "blitz"
import db from "db";

export interface PermissionsIsAuthorized {
  ({
    ctx,
    args,
  }: {
    ctx: any,
    args: [permission: string]
  }): boolean
}

const permissionsIsAuthorized: PermissionsIsAuthorized = ({ctx, args}) => {
  const [permission] = args;
  let hasPermission = true;
  if (permission !== undefined) {
    hasPermission = false;
    (async () => {
      hasPermission = await currentUserHasPermission({ permissionName: permission }, ctx);
    })();
  }
  return hasPermission;
}

const config: BlitzConfig = {
  middleware: [
    sessionMiddleware({
      cookiePrefix: "blitz-forum",
      isAuthorized: /*simpleRolesIsAuthorized*/permissionsIsAuthorized,
    }),
  ],
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
}
module.exports = config
