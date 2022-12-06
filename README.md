# Postgres REST Prisma

This project is a Node.js server built with TypeScript, Postgres, and the prima backend framework.

## Getting started
Install npm dependencies:
```
npm install
```

## Create and seed the database

Run the following command to create your database file. This also creates the `User`, `Post` and `Comment` tables that are defined in [`prisma/schema.prisma`](./prisma/schema.prisma):

```
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database, seeding is also triggered.  The seed file in [`prisma/seed.js`](./prisma/seed.js) will be executed and your database will be populated with the sample data.

## Start the Express server

Launch your server with this command:

```
npm run dev
```

Navigate to [http://localhost:4000/](http://localhost:4000/) in your browser to explore the API of server in a using this [Postman Documentation](https://documenter.getpostman.com/view/3115554/2s8YzP35EX#1deb6fec-2994-4015-9591-63083fa9a109).
