const cheerio = require('cheerio');

/**
 * Considers a response valid if it responds with anything that is less than
 * 500.
 *
 * @param  {Number} status
 * @return {Boolean}
 */
function serverResponseIsValid (status) {
  return status < 500;
}

/**
 * Considers a response valid if it returns a successful status code.
 *
 * @param  {Number} status
 * @return {Boolean}
 */
function serverResponseIsSuccessful (status) {
  return status >= 200 && status < 300;
}

/**
 * Checks the HTML text of a camera's embed for signs of an errored page load.
 *
 * @param  {String} body
 * @return {Boolean}
 */
function isPlayerErrorPresent (body) {
  const $ = cheerio.load(body);
  return $('#player-error').length > 0;
}

module.exports = {
  isPlayerErrorPresent,
  serverResponseIsSuccessful,
  serverResponseIsValid
};
