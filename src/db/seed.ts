/* eslint-disable drizzle/enforce-delete-with-where */

import { faker } from '@faker-js/faker'
import { users, stores } from './schema'
import { db } from './connection'
import chalk from 'chalk'

// Reset database
await db.delete(users)
await db.delete(stores)

console.log(chalk.yellow('✔ Database reset!'))

// Create customers
await db.insert(users).values([
  {
    name: faker.person.fullName(),
    email: 'customer1@customer.com',
    role: 'customer',
  },
  {
    name: faker.person.fullName(),
    email: 'customer2@customer.com',
    role: 'customer',
  },
])

console.log(chalk.yellow('✔ Created customers!'))

// Create manager

const [manager] = await db
  .insert(users)
  .values([
    {
      name: faker.person.fullName(),
      email: 'admin@admin.com',
      role: 'manager',
    },
  ])
  .returning({
    id: users.id,
  })

console.log(chalk.yellow('✔ Created manager!'))

// Create store

await db.insert(stores).values([
  {
    name: faker.company.name(),
    description: faker.lorem.paragraph(),
    managerId: manager.id,
  },
])

console.log(chalk.yellow('✔ Created store!'))
console.log(chalk.greenBright('✔ Database seeded successfully!'))

process.exit()
