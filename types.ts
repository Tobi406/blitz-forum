import { DefaultCtx, SessionContext, SimpleRolesIsAuthorized, BlitzPage } from "blitz"
import { PermissionsIsAuthorized } from "blitz.config"
import { User } from "db"

// Note: You should switch to Postgres and then use a DB enum for role type

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
    isAuthorized: /*PermissionsIsAuthorized*/SimpleRolesIsAuthorized,
  }
  export interface Session {
    PublicData: {
      userId: User["id"]
      role: "user"
    }
  }
}
