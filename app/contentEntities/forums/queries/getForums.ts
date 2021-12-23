import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetForumsInput
  extends Pick<Prisma.ForumFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetForumsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: forums,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.forum.count({ where }),
      query: (paginateArgs) => db.forum.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      forums,
      nextPage,
      hasMore,
      count,
    }
  }
)
