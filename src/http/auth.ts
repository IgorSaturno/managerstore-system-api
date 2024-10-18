import Elysia, { t, type Static } from 'elysia'
import { env } from '../env'
import jwt from '@elysiajs/jwt'

export const jwtPayload = t.Object({
  sub: t.String(),
  storeId: t.Optional(t.String()),
})

export const auth = new Elysia()
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: jwtPayload,
    }),
  )
  .derive({ as: 'scoped' }, ({ jwt, cookie: { auth } }) => {
    return {
      signUser: async (payload: Static<typeof jwtPayload>) => {
        const token = await jwt.sign(payload)

        auth.value = token
        auth.httpOnly = true
        auth.maxAge = 60 * 60 * 24 * 7 // 7 days
        auth.path = '/'
      },
      signOut: async () => {
        auth.remove()
      },

      getCurrentUser: async () => {
        const payload = await jwt.verify(auth.value)

        if (!payload) {
          throw new Error('Unathorized.')
        }

        return {
          userId: payload.sub,
          storeId: payload.storeId,
        }
      },
    }
  })
