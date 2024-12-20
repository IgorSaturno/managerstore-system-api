import { Elysia } from 'elysia'
import { registerStores } from './routes/register-stores.ts'
import { sendAuthLink } from './routes/send-auth-link'
import { authenticateFromLink } from './routes/authenticate-from-link'
import { signOut } from './routes/sign-out.ts'
import { getProfile } from './routes/get-profile.ts'
import { getManagedStore } from './routes/get-managed-store.ts'

const app = new Elysia()
  .use(registerStores)
  .use(sendAuthLink)
  .use(authenticateFromLink)
  .use(signOut)
  .use(getProfile)
  .use(getManagedStore)
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'VALIDATION': {
        set.status = error.status
        return error.toResponse()
      }
      default: {
        console.error(error)
        return new Response(null, { status: 500 })
      }
    }
  })

app.listen(3333, () => {
  console.log('HTTP server running!')
})
