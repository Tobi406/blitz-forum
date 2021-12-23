import { NotFoundError, resolver } from "blitz";
import db from "db";
import { z } from "zod";

export const ChangeUsername = z.object({
  userId: z.number(),
  username: z.string().nonempty(),
});

export default resolver.pipe(
  resolver.zod(ChangeUsername),
  resolver.authorize(),
  async ({ userId, username }) => {
    const user = await db.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFoundError();

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: username,
      },
    });

    return true;
  },
);

