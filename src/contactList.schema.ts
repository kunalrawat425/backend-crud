import { Field, ObjectType, InputType, ID } from "type-graphql";
import { PhoneNumber, PhoneNumberInput } from "./phoneNumber.schema";
import {
  Entity,
  BaseEntity,
  ObjectIdColumn,
  Column,
  ObjectID,
  OneToMany,
} from "typeorm";

@Entity()
@ObjectType()
export class ContactList extends BaseEntity {
  @Field(() => ID)
  @ObjectIdColumn()
  readonly id!: ObjectID;

  @Field(() => String)
  @Column()
  firstName!: string;

  @Field(() => String)
  @Column()
  lastName!: string;

  @Field({ nullable: true })
  @Column()
  img?: string;

  @Field(() => [PhoneNumber])
  @OneToMany(() => PhoneNumber, (phoneNumber) => phoneNumber.contact, { cascade: true })
  phoneNumbers?: PhoneNumber[];
}

@InputType()
export class ContactListInput {
  @Field(() => ID, { nullable: true })
  @ObjectIdColumn()
  readonly id?: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field({ nullable: true })
  img?: string;

  @Field(type => [PhoneNumberInput])
  @OneToMany(() => PhoneNumber, phoneNumber => phoneNumber.contact, { cascade: true })
  phoneNumbers?: PhoneNumberInput[];
}
