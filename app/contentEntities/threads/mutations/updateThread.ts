import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateThread = z.object({
  id: z.number(),
  title: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateThread),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const thread = await db.thread.update({ where: { id }, data })

    return thread
  }
)
