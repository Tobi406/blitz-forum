import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const RemoveGroup = z.object({
  userId: z.number(),
  groupId: z.number(),
});

export default resolver.pipe(
  resolver.zod(RemoveGroup),
  resolver.authorize(),
  async ({ userId, groupId }) => {
    
    const groupsToGroupsOnUsers = await db.groupsOnUsers.deleteMany({
      where: {
        userId: userId,
        groupId: groupId,
      },
    });

    return groupsToGroupsOnUsers;
  }
)
