import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const AddUserGroup = z.object({
  groupId: z.number(),
  userId: z.number(),
});

export default resolver.pipe(
  resolver.zod(AddUserGroup),
  resolver.authorize(),
  async ({ groupId, userId }) => {
    const groupsOnUser = await db.groupsOnUsers.create({
      data: {
        groupId: groupId,
        userId: userId,
      },
    });

    return groupsOnUser;
  },
);
