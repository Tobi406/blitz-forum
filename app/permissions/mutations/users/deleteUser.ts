import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const DeleteUser = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteUser),
  resolver.authorize(),
  async ({ id }) => {
    const usersToGroupsOnUsers = await db.groupsOnUsers.deleteMany({
      where: {
        userId: id,
      },
    });
    const user = await db.user.delete({
      where: {
        id: id,
      },
    });
  }
)
