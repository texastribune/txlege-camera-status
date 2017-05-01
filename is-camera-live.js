const axios = require('axios');
const {
  isPlayerErrorPresent,
  serverResponseIsSuccessful,
  serverResponseIsValid
} = require('./utils');

/**
 * An instance of axios with a custom validateStatus check. For our purposes, a
 * 404 response is "valid" because it tells us a stream is not live.
 *
 * @type {Function}
 */
const axiosInstance = axios.create({
  validateStatus: serverResponseIsValid
});

/**
 * Visits the provided .m3u8 URL and determines whether it points at a valid
 * video feed. Only performs a HEAD check.
 *
 * @param  {String} feedUrl
 * @return {Promise}
 */
function validateM3u8Feed (feedUrl) {
  return axiosInstance.head(feedUrl).then(({ status }) => serverResponseIsSuccessful(status));
}

/**
 * Uses a provided chamber name and camera ID to build a URL to check a
 * camera's streaming status. Returns a Promise.
 *
 * @param  {String}  chamber
 * @param  {Number}  cameraId
 * @return {Promise}
 */
function isCameraLive (chamber, cameraId) {
  if (!['house', 'senate'].includes(chamber)) {
    throw new Error('`chamber` must be either "house" or "senate"');
  }

  const streamUrl = `https://tlc${chamber}.granicus.com/player/GetStreams.php?camera_id=${cameraId}`;
  const cameraUrl = `https://tlc${chamber}.granicus.com/MediaPlayer.php?camera_id=${cameraId}`;

  const validateStream = axiosInstance.get(streamUrl).then(({ data }) => {
    if (Array.isArray(data)) {
      return validateM3u8Feed(data[1]);
    } else {
      return false;
    }
  });

  const validateCamera = axiosInstance.get(cameraUrl).then(({ data }) => {
    return !isPlayerErrorPresent(data);
  });

  return Promise.all([validateStream, validateCamera]).then(([streamIsValid, cameraIsValid]) => {
    return streamIsValid && cameraIsValid;
  });
}

module.exports = isCameraLive;
