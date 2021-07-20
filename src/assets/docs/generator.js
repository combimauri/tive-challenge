const { v4: uuidv4 } = require("uuid");
const randomName = require("random-name");

const randomNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const generateLevel = () => {
  return randomNumber(1, 10);
};

const generateCoins = () => {
  return randomNumber(1, 88);
};

const generateTime = () => {
  return randomNumber(1, 90000);
};

const generateCountry = () => {
  const countries = ["BO", "AR", "US", "CA", "CO", "MX"];
  const index = randomNumber(0, countries.length - 1);
  return countries[index];
};

const generateData = () => {
  console.log("[");
  let friendId = "";
  for (let i = 0; i < 5000; i++) {
    const userId = uuidv4();
    const fullName = `${randomName.first()} ${randomName.last()}`;
    const level = generateLevel();
    const coins = generateCoins();
    const time = generateTime();
    const country = generateCountry();

    console.log(
      `{"userId": "${userId}", "name": "${fullName}", "level": "${level}", "coins": "${coins}", "time": "${time}", "country": "${country}", "friends": ["${friendId}"]},`
    );

    friendId = userId;
  }
  console.log("]");
};

generateData();
