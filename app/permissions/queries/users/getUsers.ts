import { paginate, resolver } from "@blitzjs/core/server";
import db, { Prisma } from "db";

interface GetUsersInput
  extends Pick<
    Prisma.UserFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetUsersInput) => {
    const {
      items,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.user.count({ where }),
      query: (paginatedArgs) =>
        db.user.findMany({ ...paginatedArgs, where, orderBy }),
    });

    return {
      items,
      nextPage,
      hasMore,
      count,
    };
  }
);
