import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const DeleteGroup = z.object({
  id: z.number(),
});

// untested
export default resolver.pipe(
  resolver.zod(DeleteGroup),
  resolver.authorize(),
  async ({ id }) => {
    const groupToGroupsOnUsers = await db.groupsOnUsers.deleteMany({
      where: {
        groupId: id,
      },
    });
    const groupToPermission = await db.permission.deleteMany({
      where: {
        groupId: id,
      },
    });
    const group = await db.group.delete({
      where: {
        id: id,
      },
    });

    return group;
  },
);
