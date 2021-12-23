import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetForum = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetForum), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const forum = await db.forum.findFirst({ where: { id } })

  if (!forum) throw new NotFoundError()

  return forum
})
