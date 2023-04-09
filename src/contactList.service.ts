import { Service } from "typedi";
import { ContactList, ContactListInput } from "./contactList.schema";
const { ObjectId } = require("mongodb");
import "reflect-metadata";
import { PhoneNumber } from "./phoneNumber.schema";
import { AppDataSource } from "..";

@Service()
export class contactListService {
  async getContacts() {
    try {
      return await ContactList.find({
        relations: {
          phoneNumbers: true,
        },
      });
    } catch (err) {
      throw new Error("Unable to find");
    }
  }

  async getContact(id: string) {
    try {
      return await AppDataSource.getMongoRepository(ContactList).findOne({
        where: { id: ObjectId(id) },
        relations: {
          phoneNumbers: true,
        },
      });
    } catch (err) {
      throw new Error("Unable to find");
    }
  }

  async upsert(data: ContactListInput) {
    try {
      const { phoneNumbers, ...contactData } = data;

      let contact = new ContactList();
      contact.firstName = contactData.firstName;
      contact.lastName = contactData.lastName;

      contact = await ContactList.save(contact);

      const promises: Promise<PhoneNumber>[] | undefined = phoneNumbers?.map(
        async (phoneEntry) => {
          const phoneN = new PhoneNumber();
          phoneN.callingCode = phoneEntry.callingCode;
          phoneN.phone = phoneEntry.phone;
          phoneN.contact = ObjectId(contact.id);
          return await PhoneNumber.save(phoneN);
        }
      );

      contact.phoneNumbers =
        promises &&
        (await Promise.all(promises)
          .then((results: PhoneNumber[]) => results)
          .catch((error: any) => {
            return [];
          }));
      return contact;
    } catch (err) {
      throw new Error("Failed to create");
    }
  }

  async delete(id: string) {
    try {
      if (!(await ContactList.findOne(ObjectId(id)))) {
        throw new Error("Record not found");
      }
      await ContactList.delete([id]);
      return true;
    } catch (err) {
      throw new Error("Failed to delete");
    }
  }
}
