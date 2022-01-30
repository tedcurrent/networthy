## Networthy
Measure your networth over time.

For now this is just a tech playground before auth is implemented.

## Dev setup

### Run dev environment
`npm run dev -- -p <PORT>`

### Run dev database
A serverless MySQL DB, [PlanetScale](https://planetscale.com/), is used. After setting up PlanetScale, connect:

`pscale connect networthy <BRANCH>`

Be sure to also run a [shadow database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database) on the side if making changes to the schema. This needs to be set up in PlanetScale as PlanetScale does allow dropping or creating databases with SQL.

### Run migrations locally
`npx dotenv -e .env.local -- npx prisma migrate dev`

### Run db seed
`npx dotenv -e .env.local -- npx prisma db seed`

### Format migrations locally
`npx prisma format`
