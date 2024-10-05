import { Elysia } from 'elysia'
import { registerStores } from './routes/register-stores'
import { sendAuthLink } from './routes/send-auth-link'

const app = new Elysia().use(registerStores).use(sendAuthLink)

app.listen(3333, () => {
  console.log('HTTP server running!')
})
