import { NotFoundError, resolver } from "blitz";
import db from "db";
import { z } from "zod";

const GetGroup = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(GetGroup),
  resolver.authorize(),
  async ({ id }) => {
    const group = await db.group.findFirst({
      where: {
        id: id,
      },
    });

    if (!group) throw new NotFoundError();

    return group;
  }
)
