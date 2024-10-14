import Elysia, { t } from 'elysia'
import { env } from '../env'
import cookie from '@elysiajs/cookie'
import jwt from '@elysiajs/jwt'

export const auth = new Elysia()
  .use(
    jwt({
      secret: env.JWT_SECRET_KEY,
      schema: t.Object({
        sub: t.String(),
        storeId: t.Optional(t.String()),
      }),
    }),
  )
  .use(cookie())
