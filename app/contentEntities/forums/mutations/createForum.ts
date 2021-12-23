import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateForum = z.object({
  name: z.string(),
})

export default resolver.pipe(resolver.zod(CreateForum), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const forum = await db.forum.create({ data: input })

  return forum
})
