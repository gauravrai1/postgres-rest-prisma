import Prisma from "../lib/Prisma";

const init = () =>
  new Promise<string>(async (resolve, reject) => {
    try {
        // connecting to postgresDB
        await Prisma.$connect();
        resolve("Connected to all the services");
    } catch (err) {
        reject("Error connecting to the services");
    }
  });

export default init;
