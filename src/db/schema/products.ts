import { text, timestamp, pgTable, integer } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { stores } from './stores'
import { relations } from 'drizzle-orm'
import { orderItems } from './order-items'

export const products = pgTable('products', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  priceInCents: integer('price_in_cents').notNull(),
  storeId: text('store_id')
    .notNull()
    .references(() => stores.id, {
      onDelete: 'cascade',
    }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const productsRelations = relations(products, ({ one, many }) => {
  return {
    store: one(stores, {
      fields: [products.storeId],
      references: [stores.id],
      relationName: 'product_store',
    }),
    orderItems: many(orderItems),
  }
})
