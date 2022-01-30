### Run dev environment
`npm run dev -- -p <PORT>`

### Run dev database
A serverless MySQL DB, [PlanetScale](https://planetscale.com/), is used. After setting up PlanetScale, connect:

`pscale connect networthy <BRANCH>`

Be sure to also run a shadow database on the side when making changes to the schema. As the dev environment, this needs to be set up in PlanetScale as PlanetScale does allow dropping or creating databases with SQL.

### Run migrations locally
`npx dotenv -e .env.local -- npx prisma migrate dev`

### Run db seed
`npx dotenv -e .env.local -- npx prisma db seed`

### Format migrations locally
`npx prisma format`

### TODO
- [ ] Add support for viewing wealth breakdown
- [ ] Add support for inputting wealth through the client
- [ ] E2E tests with Cypress
- [ ] Feature tests
- [ ] Add some light animations
- [ ] Add dark / light mode support
- [ ] Add missing accessibility support 
- [ ] Run lighthouse and log down needed changes
- [ ] Unit tests
- [ ] More Readme
- [ ] Add auth
- [ ] Figure out why [data transformers](https://trpc.io/docs/data-transformers) don't work
- [x] Add chart to show trend over time
- [x] Setup production database
