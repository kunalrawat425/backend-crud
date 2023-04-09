import "reflect-metadata";
import { ContactList } from "./src/contactList.schema";
import { contactListService } from "./src/contactList.service";
import { Container } from "typedi";
import { DataSource } from "typeorm";
const { ObjectId } = require("mongodb");

describe("Db connect", () => {
  let service: contactListService;
  let data1 = {
    firstName: "kunal",
    lastName: "Rawat",
  };
  let data2 = {
    firstName: "John",
    lastName: "Doe",
  };
  const AppDataSource = new DataSource({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    useUnifiedTopology: true,
    database: ":memory:",
    entities: [ContactList],
    synchronize: true,
    logging: false,
  });

  beforeAll(async () => {
    service = Container.get(contactListService);

    await AppDataSource.initialize()
      .then(() => {
        console.log("DB initialized");
      })
      .catch((error) => console.log("db error", error));
  });

  afterAll(async () => {
    await AppDataSource.dropDatabase();
    await AppDataSource.destroy();
  });

  describe("Test cases for retrieve", () => {
    let createdRecord1: any;
    beforeAll(async () => {
      createdRecord1 = await service.upsert(data1);
      const createdRecord2 = await service.upsert(data1);
    });

    test("should retrieve a specific record by its unique id", async () => {
      const contact = await service.getContact(createdRecord1.id);
      expect(contact).toEqual(createdRecord1);
    });

    test("should retrieve all records", async () => {
      const contact = await service.getContacts();
      expect(contact).toHaveLength(2);
    });

    test("should throw an error message when attempting to retrieve a non-existent record", async () => {
      const nonExistentId = "123";
      await expect(service.getContact(nonExistentId)).rejects.toThrow(
        "Unable to find"
      );
    });
  });

  describe("Test cases for upsert", () => {
    let createdRecord: any = {};
    beforeAll(async () => {
      createdRecord = await service.upsert(data1);
    });

    test("should create record with new values for one or more fields", async () => {
      expect(1).toBe(1);
      expect(createdRecord.firstName).toBe(data1.firstName);
    });

    test("should update an existing record with new values for one or more fields", async () => {
      const newData = {
        firstName: "kunal",
        LastName: "rawat",
        id: createdRecord.id,
      };
      const updatedRecord = await service.upsert(data1);
      expect(1).toBe(1);
      expect(updatedRecord.firstName).toBe(newData.firstName);
    });

    // test("should enforce validation rules when updating a record", async () => {
    //   // Arrange
    //   const data = { name: "John", age: 30 };
    //   const createdRecord = await createRecord(data);
    //   const newData = { age: null }; // Age is a required field

    //   // Act and Assert
    //   await expect(updateRecord(createdRecord.id, newData)).rejects.toThrow(
    //     "Validation error"
    //   );
    // });

    // test("should return an error message when attempting to update a non-existent record", async () => {
    //   // Arrange
    //   await expect(retrieveRecord(nonExistentId)).rejects.toThrow(
    //     "Record not found"
    //   );
    // });
  });

  describe("Test cases for delete", () => {
    let contactList1: ContactList;

    beforeAll(async () => {
      contactList1 = await service.upsert(data1);
    });

    test("should delete record", async () => {
      await service.delete(Object(contactList1.id));

      const fetchContactList = await service.getContact(
        ObjectId(contactList1.id)
      );
      expect(fetchContactList).toBeNull();
    });

    test("should throw an error on delete nonexisting record", async () => {
      await expect(service.delete(Object(contactList1.id))).rejects.toThrow(
        "Failed to delete"
      );
    });
  });

  describe("Test cases for retrieve", () => {
    let createdRecord1: any;
    beforeAll(async () => {
      createdRecord1 = await service.upsert(data1);
      const createdRecord2 = await service.upsert(data1);
    });

    test("should retrieve a specific record by its unique id", async () => {
      const contact = await service.getContact(createdRecord1.id);
      expect(contact).toEqual(createdRecord1);
    });

    test("should retrieve all records", async () => {
      const contact = await service.getContacts();
      expect(contact).toHaveLength(6);
    });

    // test("should retrieve a list of records based on specified search criteria", async () => {

    //   const retrievedRecords = await service.getContacts({ category: "A" });
    //   expect(retrievedRecords.length).toBe(2);
    // });

    // test("should return an error message when attempting to retrieve a non-existent record", async () => {
    //   // Arrange
    //   const nonExistentId = "123";

    //   // Act and Assert
    //   await expect(retrieveRecord(nonExistentId)).rejects.toThrow(
    //     "Record not found"
    //   );
    // });
  });
});
