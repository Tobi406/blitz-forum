import { NotFoundError, resolver } from "blitz";
import db from "db";
import { z } from "zod";

export const ChangeEmail = z.object({
  userId: z.number(),
  email: z.string().email(),
});


export default resolver.pipe(
  resolver.zod(ChangeEmail),
  resolver.authorize(),
  async ({ userId, email }) => {
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
        email,
      },
    });

    return true;
  },
)

