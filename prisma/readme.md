% npx prisma migrate dev --schema ./prisma/


npx prisma generate --schema=./prisma/schema.prisma

npx prisma migrate  dev
npx prisma migrate resolve --applied {name migratoin}


npx prisma migrate diff \
--from-empty \
--to-schema-datamodel prisma/schema.prisma \
--script > prisma/migrations/0_init/migration.sql


