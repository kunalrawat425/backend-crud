import { Field, ObjectType, InputType, ID } from "type-graphql";
import { MaxLength } from "class-validator";
import { BaseEntity, Column, Entity, Index, ManyToOne, ObjectID, ObjectIdColumn} from "typeorm";
import { ContactList } from "./contactList.schema";

@Entity()
@ObjectType()
export class PhoneNumber extends BaseEntity{

  @Field(() => ID)
  @ObjectIdColumn()
  readonly id!: ObjectID;
  
  @Field(() => ContactList)
  @ManyToOne(() => ContactList, (contact) => contact.phoneNumbers)
  contact!: ContactList;

  @Field()
  @Column()
  callingCode!: string;

  @Field()
  @Column()
  phone!: string;
}

@InputType()
export class PhoneNumberInput  {
  
  @Field()
  callingCode!: string;

  @Field()
  @MaxLength(30)
  phone!: string;
}
