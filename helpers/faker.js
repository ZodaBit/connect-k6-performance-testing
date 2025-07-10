import { Faker } from "k6/x/faker";
const faker = new Faker();

export function getFakeName() {
  return {
    firstName: faker.person.firstName(),
    middleName:faker.person.middleName(),
    lastName: faker.person.lastName(),
  };
}

export function getFakeAddress() {
  return {
    address: faker.address.streetName(),
    city: faker.address.city(),
    country: faker.address.country(),
  };
}
