import asyncMap from "app/util/asyncMap";
import { resolver } from "blitz";
import { Group } from "db";
import { z } from "zod";
import getGroupsOnUser from "../getGroupsOnUser";
import getGroup from "./getGroup";

const GetUserGroups = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(GetUserGroups),
  resolver.authorize(),
  async ({ id }, ctx) => {
    const groupIds = await getGroupsOnUser({ id }, ctx);

    const groups = await asyncMap<number, Group>(groupIds, async (groupId) => {
      return await getGroup({ id: groupId }, ctx);
    });
    return groups;
  },
);
