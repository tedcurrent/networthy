## Networthy
Measure your networth over time. Mockup snapshot in [Excalidraw](https://excalidraw.com/#json=iVQxHNeDsKS2U5OC17F5j,b6sOur89KJlZ8f0ko1arGg).

For now this is just a tech playground before auth is implemented.

### Built with
- Next.js
- Tailwindcss
- React-query
- TRPC
- Prisma
- Planetscale

## Dev setup

### Run dev environment
`npm run dev -- -p <PORT>`

### Run dev database
A serverless MySQL DB, [PlanetScale](https://planetscale.com/), is used. After setting up PlanetScale, connect:

`pscale connect networthy <BRANCH>`

Be sure to also run a [shadow database](https://www.prisma.io/docs/concepts/components/prisma-migrate/shadow-database) on the side if making changes to the schema. This needs to be set up in PlanetScale as PlanetScale does not allow dropping or creating databases with SQL.

### Run migrations locally
`npx dotenv -e .env.local -- npx prisma migrate dev`

### Run db seed
`npx dotenv -e .env.local -- npx prisma db seed`

### Format migrations locally
`npx prisma format`

### Deployment
Automatic deployment when pushing to the main branch. Deployed to and with [Vercel](https://vercel.com/).
