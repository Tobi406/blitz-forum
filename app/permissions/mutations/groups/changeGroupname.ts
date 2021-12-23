import { NotFoundError, resolver } from "blitz";
import db from "db";
import { z } from "zod";

export const ChangeGroupname = z.object({
  groupId: z.number(),
  groupname: z.string().nonempty(),
});

export default resolver.pipe(
  resolver.zod(ChangeGroupname),
  resolver.authorize(),
  async ({ groupId, groupname }) => {
    const group = await db.group.findFirst({
      where: {
        id: groupId,
      },
    });
    if (!group) throw new NotFoundError();

    await db.group.update({
      where: {
        id: group.id,
      },
      data: {
        name: groupname,
      },
    });

    return true;
  },
);

