import { getFakeName, getFakeAddress } from "../helpers/faker.js";
import { getRandomGender, generateRandomPhoneNumber } from "../helpers/utils.js";

export function createUserPayload() {
  const { firstName,middleName, lastName } = getFakeName();
  const { address, city, country } = getFakeAddress();

  return {
    firstName,
    middleName,
    lastName,
    gender: getRandomGender(),
    address,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    phoneNumber: generateRandomPhoneNumber(),
    city,
    country,
    realm: "member",
  };
}
