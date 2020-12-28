const functions = require('firebase-functions');
const fs = require('fs');
const cors = require('cors')({
  origin: true,
});

const ENCODING = 'utf8';
const USERS_PATH = 'assets/data/users.data.json';
const ITEMS_PER_PAGE = 10;
const TIME_TO_LEVEL_UP = 28800; // Represents 8 hours in seconds
const ALLOWED_ORIGINS = [
  'http://localhost:4200', // 4200 is the default port used by Angular in dev mode
  'http://localhost:8080', // 8080 is the default port used by http-server in prod mode
  'http://127.0.0.1:4200',
  'http://127.0.0.1:8080',
  // Firebase default domains for production
  'https://tive-challenge.web.app',
  'https://tive-challenge.firebaseapp.com',
];

/**
 * Retrieves users by page and filters
 * @queryParam userId: the user identification in order to set current page
 * in case page param is not sent, and to use it with the filter params
 * @queryParam page: if sent, this page of items will be retrieved
 * @queryParam filterBy: this value can be 'country' or 'friends', so users are
 * filtered according to national or friends ranking, if it is not present, the
 * global ranking of users will be retrieved
 * @returns a user response with the users, the current page number, the number
 * of items being used by page, and a boolean property telling if there are more
 * users in next pages
 */
exports.getUsers = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    verifyOrigin(request, response);

    const { userId, page, filterBy } = request.query || {};
    const users = getUsersFromDataFile({ userId, filterBy });
    const pageNumber = getPageNumber({ users, userId, page });
    const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const items = users.slice(startIndex, endIndex);
    const hasMore = Boolean(users[endIndex]);

    response.send({
      items,
      hasMore,
      pageNumber,
      itemsPerPage: ITEMS_PER_PAGE,
    });
  });
});

/**
 * Retrieves user by id
 * @queryParam userId: the user identification in order to search it an return it
 * @returns user filtered by its id, error if not found or if param was not sent
 */
exports.getUser = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    verifyOrigin(request, response);

    const userId = request.query.userId;

    if (userId) {
      const users = getUsersFromDataFile();
      const user = users.find((user) => user.userId === userId);

      if (user) {
        response.send(user);
      } else {
        response.status(404).send({ message: 'User not found.' });
      }
    } else {
      response.status(400).send({ message: 'userId param was not sent.' });
    }
  });
});

/**
 * Heartbeat function to test if API is working fine
 */
exports.helloWorld = functions.https.onRequest((_request, response) => {
  cors(request, response, () => {
    verifyOrigin(request, response);
    functions.logger.info('Hello logs!', { structuredData: true });
    response.send('Hello from Firebase!');
  });
});

/**
 * Enables CORS for defined origins
 * @param request: origin is extrated from this param to compare against
 * allowed origins
 * @param response: used to set the 'Access-Control-Allow-Origin' header
 * if request origin is part of the allowed origins
 */
function verifyOrigin(request, response) {
  const origin = request.headers.origin;

  if (ALLOWED_ORIGINS.indexOf(origin) > -1) {
    response.set('Access-Control-Allow-Origin', origin);
  }
}

/**
 * Retrieves all users from json file, filters them, calculates
 * some properties for them (level and time) and sorts them by score
 * @param params: optional params object that should contain 'userId'
 * and 'filterBy' properties in order to filter users
 * @returns users after mapping and filtering them
 */
function getUsersFromDataFile(params = {}) {
  try {
    let users = JSON.parse(fs.readFileSync(USERS_PATH, ENCODING));
    users = filterUsers(users, params);

    users.map((user) => parseUser(user));
    sortUsersByScore(users);

    return users;
  } catch (_error) {
    return [];
  }
}

/**
 * Retrieves the current page number
 * @param params: optional object that should contain 'page' property
 * or 'users' and 'userId' properties to define the current page number
 * @returns the passed 'page', the page where 'userId' is placed, or page number 1
 */
function getPageNumber({ users, userId, page }) {
  if (page) {
    return Number(page);
  } else if (userId) {
    idIndex = users.findIndex((user) => user.userId === userId);

    if (idIndex > -1) {
      return Math.trunc(idIndex / ITEMS_PER_PAGE) + 1;
    }
  }

  return 1;
}

/**
 * Filters users by country or friends
 * @param users: all users in json file
 * @param params: optional object that should have 'userId' and 'filterBy'
 * properties
 * @returns users after they are filtered if params were sent
 */
function filterUsers(users, { userId, filterBy } = {}) {
  if (userId) {
    const foundUser = users.find((user) => user.userId === userId);

    if (foundUser) {
      if (filterBy === 'country') {
        return users.filter((user) => user.country === foundUser.country);
      } else if (filterBy === 'friends') {
        const friendsAndUser = [...foundUser.friends, userId];
        return users.filter((user) => friendsAndUser.includes(user.userId));
      }
    }
  }

  return users;
}

/**
 * Parses numeric properties, calculates wrong properties (level and tiem)
 * and adds missing one (score)
 * @param user: user to be parsed
 */
function parseUser(user) {
  parseNumericValues(user);
  levelUpIfNeeded(user);
  calculateScore(user);
}

/**
 * Converts 'level', 'coins', and 'time' properties to numbers in case they
 * are retrieved as strings from json file
 * @param user: user to be parsed
 */
function parseNumericValues(user) {
  user.level = Number(user.level);
  user.coins = Number(user.coins);
  user.time = Number(user.time);
}

/**
 * If user time exceeds 8 hours, level and time are recalculated
 * @param user: user to be parsed
 */
function levelUpIfNeeded(user) {
  const { time } = user;

  if (time >= TIME_TO_LEVEL_UP) {
    user.level += Math.trunc(time / TIME_TO_LEVEL_UP);
    user.time = time % TIME_TO_LEVEL_UP;
  }
}

/**
 * Missing 'score' property is added to the user, based in its level,
 * coins and time
 * @param user: user to be parsed
 */
function calculateScore(user) {
  user.score = user.level * user.coins + user.time;
}

/**
 * Sorts users by score in descending order to position them
 * @param users: users to be sorted
 */
function sortUsersByScore(users) {
  users.sort((userA, userB) => compareUsersByScore(userA, userB));
}

/**
 * Comparation function for sorting users in descending order
 * @param userA: users to be sorted
 * @param userB: users to be sorted
 */
function compareUsersByScore(userA, userB) {
  const { score: scoreA } = userA;
  const { score: scoreB } = userB;

  if (scoreA < scoreB) {
    return 1;
  } else if (scoreA > scoreB) {
    return -1;
  }

  return 0;
}
