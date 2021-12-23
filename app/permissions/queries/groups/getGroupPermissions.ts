import { NotFoundError, resolver } from "blitz";
import db from "db";
import { z } from "zod";

const GetGroupPermissions = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(GetGroupPermissions),
  resolver.authorize(),
  async ({ id }) => {
    const group = db.group.findFirst({
      where: {
        id: id,
      },
    });

    if (!group) throw new NotFoundError();

    const permissions = await group.permissions();

    return permissions;
  },
);

