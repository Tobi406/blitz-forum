import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const AddGroup = z.object({
  name: z.string().nonempty(),
});

export default resolver.pipe(
  resolver.zod(AddGroup),
  resolver.authorize(),
  async ({ name }) => {
    const group = db.group.create({
      data: {
        name: name,
      },
    });

    return group;
  },
);
