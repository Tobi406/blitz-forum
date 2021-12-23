import { resolver, SecurePassword } from "blitz"
import db from "db"
import { Signup } from "app/auth/validations"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password, name }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db.user.create({
    data: { email: email.toLowerCase().trim(), hashedPassword, name: name, },
    select: { id: true, name: true, email: true },
  })

  await ctx.session.$create({ userId: user.id, role: "user" /* groups: user.groups */ })
  return user
})
