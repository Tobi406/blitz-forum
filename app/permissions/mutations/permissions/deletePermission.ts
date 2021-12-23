import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const DeletePermission = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeletePermission),
  resolver.authorize(),
  async ({ id }) => {
    const permission = await db.permission.delete({
      where: {
        id: id,
      },
    });

    return true;
  },
);
