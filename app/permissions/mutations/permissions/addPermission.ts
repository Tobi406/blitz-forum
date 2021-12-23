import { resolver } from "blitz";
import db from "db";
import { z } from "zod";

const AddPermission = z.object({
  groupId: z.number(),
  name: z.string().nonempty(),
});

export default resolver.pipe(
  resolver.zod(AddPermission),
  resolver.authorize("admin.permissions.add"),
  async ({ groupId, name }) => {
    const permission = await db.permission.create({
      data: {
        name: name,
        groupId: groupId,
        value: true,
      },
    });

    return permission;
  },
);
