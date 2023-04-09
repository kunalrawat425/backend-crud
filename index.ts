import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { ContactListResolver } from "./src/contactList.resolver"; // add this
import { buildSchema } from "type-graphql";
import { ContactList } from "./src/contactList.schema";
import { PhoneNumber } from "./src/phoneNumber.schema";
import { DataSource } from "typeorm";
import { Container } from "typedi";
export const AppDataSource = new DataSource({
  type: "mongodb",
  host: "localhost",
  port: 27017,
  useUnifiedTopology: true,
  database: "test",
  entities: [ContactList, PhoneNumber],
  synchronize: true,
  logging: false,
});

async function main() {


  await AppDataSource.initialize()
    .then(() => {
      console.log("DB initialized");
    })
    .catch((error) => console.log("db error", error));

  const schema = await buildSchema({
    resolvers: [ContactListResolver],
    container: Container,
  });
  const server = new ApolloServer({ schema });
  const PORT = 4002;
  await server.listen(PORT);
  console.log(`Server has started at http://localhost:${PORT}`);
}
main();

// join tables 1 to n
// crud relations  1 to n
// search by name and phone number on both
// all multiple phone
// unique check on calling code and phone number

// dockerize app
