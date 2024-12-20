import { text, timestamp, pgTable, pgEnum, integer } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { users } from './users'
import { relations } from 'drizzle-orm'
import { stores } from './stores'
import { orderItems } from './order-items'

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'delivering',
  'delivered',
  'cancelled',
])

export const orders = pgTable('orders', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  customerId: text('customer_id').references(() => users.id, {
    onDelete: 'set null',
  }),
  storeId: text('store_id')
    .notNull()
    .references(() => users.id, {
      onDelete: 'cascade',
    }),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalInCents: integer('total_in_cents').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const ordersRelations = relations(orders, ({ one, many }) => {
  return {
    customer: one(users, {
      fields: [orders.customerId],
      references: [users.id],
      relationName: 'order_customer',
    }),
    store: one(stores, {
      fields: [orders.storeId],
      references: [stores.id],
      relationName: 'order_store',
    }),
    orderItems: many(orderItems),
  }
})
