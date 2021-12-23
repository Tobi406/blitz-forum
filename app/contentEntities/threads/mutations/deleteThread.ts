import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteThread = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteThread), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const thread = await db.thread.deleteMany({ where: { id } })

  return thread
})
