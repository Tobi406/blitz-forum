import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateForum = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateForum),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const forum = await db.forum.update({ where: { id }, data })

    return forum
  }
)
