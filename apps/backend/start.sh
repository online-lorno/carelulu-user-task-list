#!/bin/sh
set -e

# prisma generate
npx prisma generate

# prisma migration
npx prisma migrate deploy --schema ./prisma/schema.prisma

# seed
node ./dist/prisma/seed.js

# start
node ./dist/src/main.js