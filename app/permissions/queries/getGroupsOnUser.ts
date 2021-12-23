import { NotFoundError, resolver } from "blitz";
import db from "db";
import { z } from "zod";

export const GetGroups = z.object({
  id: z.number(),
});

export default resolver.pipe(resolver.zod(GetGroups), async ({ id }) => {
  const user = db.user.findFirst({
    where: {
      id: id,
    },
  });

  if (!user) throw new NotFoundError();

  const groupsOnUser = await user.groups();
  const groupIds = groupsOnUser.map(groupsOnUser => groupsOnUser.groupId);
  return groupIds;
})
