import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateThread = z.object({
  title: z.string(),

})

export default resolver.pipe(resolver.zod(CreateThread), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const thread = await db.thread.create({ data: input as any }); // temporary solution
  
  return thread
})
