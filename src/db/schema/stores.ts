import { text, timestamp, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { users } from './users'
import { relations } from 'drizzle-orm'
import { orders } from './orders'
import { products } from './products'

// Tabela de Lojas
export const stores = pgTable('stores', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Tabela de Gerentes (associação)
export const storeManagers = pgTable(
  'store_managers',
  {
    storeId: text('store_id')
      .notNull()
      .references(() => stores.id, {
        onDelete: 'cascade',
      }),
    managerId: text('manager_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.storeId, table.managerId] }),
    }
  },
)

// Relações
export const storesRelations = relations(stores, ({ many }) => {
  return {
    managers: many(storeManagers),
  }
})

export const storeManagersRelations = relations(
  storeManagers,
  ({ one, many }) => {
    return {
      store: one(stores, {
        fields: [storeManagers.storeId],
        references: [stores.id],
      }),
      manager: one(users, {
        fields: [storeManagers.managerId],
        references: [users.id],
        relationName: 'store_managers',
      }),
      orders: many(orders),
      products: many(products),
    }
  },
)
