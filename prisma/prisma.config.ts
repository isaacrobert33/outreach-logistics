import { defineConfig } from '@prisma/internals'

export default defineConfig({
  datasource: {
    url: process.env.POSTGRES_PRISMA_URL,
  },
})
