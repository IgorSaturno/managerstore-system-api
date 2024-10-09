import Elysia, { t } from 'elysia'
import { stores, storeManagers, users } from '../../db/schema'
import { db } from '../../db/connection'

export const registerStores = new Elysia().post(
  '/stores',
  async ({ body, set }) => {
    const { storeName, managerName, email, phone } = body

    const [manager] = await db
      .insert(users)
      .values({
        name: managerName,
        email,
        phone,
        role: 'manager',
      })
      .returning({
        id: users.id,
      })

    // Inserir a loja na tabela de lojas
    const [store] = await db
      .insert(stores)
      .values({
        name: storeName,
      })
      .returning({
        id: stores.id,
      })

    // Associar o gerente à loja na tabela storeManagers
    await db.insert(storeManagers).values({
      storeId: store.id,
      managerId: manager.id,
    })

    set.status = 204
  },
  {
    body: t.Object({
      storeName: t.String(),
      managerName: t.String(),
      email: t.String({ format: 'email' }),
      phone: t.String(),
    }),
  },
)
