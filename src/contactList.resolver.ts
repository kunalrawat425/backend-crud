import "reflect-metadata";
import { Arg, Query, Resolver, Mutation } from "type-graphql";
import { Service } from "typedi";
import { ContactList, ContactListInput } from "./contactList.schema";
import { contactListService } from "./contactList.service";

@Service()
@Resolver((of) => ContactList)
export class ContactListResolver {
  constructor(
    private readonly contactListService: contactListService
  ) {}

  @Query((returns) => ContactList, { nullable: true })
  async getContact(@Arg("id") id: string): Promise<ContactList | null> {
    return this.contactListService.getContact(id);
  }

  @Query((returns) => [ContactList])
  async getContacts(): Promise<ContactList[] | null> {
    return this.contactListService.getContacts();
  }

  @Query((returns) => [ContactList])
  async search(
    @Arg("searchText") searchText: string
  ): Promise<ContactList[] | null> {
    try {
      return await ContactList.find({
        where: {
          //@ts-ignore
          $text: { $search: searchText },
        },
        take: 50,
      });
    } catch (err) {
      throw new Error("Failed while searching");
    }
  }

  @Mutation((returns) => ContactList)
  async createOrUpdateContact(
    @Arg("data") data: ContactListInput
  ): Promise<ContactList | undefined> {
    return this.contactListService.upsert(data);
  }

  @Mutation((returns) => Boolean)
  async deleteContact(@Arg("id") id: string): Promise<boolean | undefined> {
    return this.contactListService.delete(id)
  }
}
