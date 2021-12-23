import { useQuery } from "blitz"
import getCurrentUser from "app/permissions/queries/users/getCurrentUser"

export const useCurrentUser = () => {
  const [user] = useQuery(getCurrentUser, null)
  return user
}
