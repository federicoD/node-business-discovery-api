## Intro

This is my first nodejs/ts API and it has been done while learning how a newborn works as well, so not my proudest piece of work.

I used the following libraries:
- typeorm and sqlite
- morgan and winston for logging
- dotenv for the variables
- helmet to help with http headers and security best practices
- jest for testing

### What's missing

- Docker file
- DB Migrations
- Authentication
- Rate limiting
- Linting

### Should be improved

- use an enum for business type instead of a string
- log response's body when status code is not successful (custom middleware)
- use something different than ConsoleLogger when environment is not development
- use something different than sqlite in development?
- more tests
- support for miles?

## Run the project

1) Create a .env file at the root level of the project directory and copy these variables:

```
PORT=4321
DB_FILE=squid_db.sqlite
NODE_ENV=development
```

2) Run the seed script: `ts-node src\database\seed.ts`

3) Run the project: `npm run dev`

If you want to run the tests use: `npm run test`