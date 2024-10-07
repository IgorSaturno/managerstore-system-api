import { text, timestamp, pgTable } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { users } from './users'
import { relations } from 'drizzle-orm'

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
    storeId: text('store_id').references(() => stores.id, {
      onDelete: 'cascade',
    }),
    managerId: text('manager_id').references(() => users.id, {
      onDelete: 'cascade',
    }),
  },
  {
    primaryKey: ['storeId', 'managerId'],
  },
)

// Relações
export const storesRelations = relations(stores, ({ many }) => {
  return {
    managers: many(storeManagers, {
      fields: [stores.id],
      references: [storeManagers.storeId],
      relationName: 'store_managers',
    }),
  }
})

export const storeManagersRelations = relations(storeManagers, ({ one }) => {
  return {
    store: one(stores, {
      fields: [storeManagers.storeId],
      references: [stores.id],
    }),
    manager: one(users, {
      fields: [storeManagers.managerId],
      references: [users.id],
    }),
  }
})
