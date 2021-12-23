import asyncSome from "app/util/asyncSome";
import { resolver } from "blitz";
import db from "db";
import { z } from "zod";
import getGroups from "./getGroupsOnUser";


const UserHasPermission = z.object({
  permissionName: z.string(),
  userId: z.number(),
});
const GroupHasPermission = z.object({
  permissionName: z.string(),
  groupId: z.number(),
});
const CurrentUserHasPermission = z.object({
  permissionName: z.string(),
});

const groupHasPermission = resolver.pipe(resolver.zod(GroupHasPermission), async ({
  permissionName,
  groupId,
}) => {
  const group = db.group.findFirst({
    where: {
      id: groupId,
    },
  });
  const permissions = await group.permissions();
  return permissions.some(permission =>
      permission.name === permissionName &&
      permission.value === true
    );
});

export const userHasPermission = resolver.pipe(resolver.zod(UserHasPermission), async ({
  permissionName,
  userId,
}, ctx) => {
  const groups = await getGroups({ id: userId }, ctx);

  return await asyncSome(groups, async (group) => {
    return await groupHasPermission({
      permissionName: permissionName,
      groupId: group,
    }, ctx);
  });
});

export const hasPermission = resolver.pipe(resolver.zod(CurrentUserHasPermission), async ({
  permissionName,
}, ctx) => {
  if (!ctx.session.userId || ctx.session.userId === null) return false;

  const hasPermission = await userHasPermission({
    permissionName: permissionName,
    userId: ctx.session.userId,
  }, ctx);
  return hasPermission;
});


export default hasPermission;
