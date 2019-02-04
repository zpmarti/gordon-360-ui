/**
 * Victory Promise
 *
 * @module victoryPromise
 */

import http from './http';
import user from './user';

/**
 * @global
 * @typedef VPScores
 * @property {Number} im Intellectual Maturity score
 * @property {Number} cc Christian Character score
 * @property {Number} ls Lives of Service score
 * @property {Number} lw Leadership Worldwide score
 */

/**
 * Get victory promise scores
 * @param {String} id student id
 * @return {Promise.<VPScores>} scores
 */
const getScoreById = async () => {
  const { id } = user.getLocalInfo();
  console.log('getScoreById called. id = ' + id);
  return await http.get(`vpscore/${id}`);
};

export default {
  getScoreById,
};
