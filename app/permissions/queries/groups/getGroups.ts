import { paginate, resolver } from "@blitzjs/core/server";
import db, { Prisma } from "db";

interface GetGroupsInput
  extends Pick<
    Prisma.GroupFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 3 }: GetGroupsInput) => {
    const {
      items,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.group.count({ where }),
      query: (paginatedArgs) =>
        db.group.findMany({ ...paginatedArgs, where, orderBy }),
    });

    return {
      items,
      nextPage,
      hasMore,
      count,
    };
  }
);
