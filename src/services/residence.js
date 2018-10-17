/**
 * Residence ( Handles residence details for orientation page )
 *
 * @module residence
 */

import http from './http';

/**
 * Takes the result of the GetRoomAssignment query and returns a boolean of whether the student
 * is placed in their residence hall or not
 *
 * @returns {String} Returns the room assignment for the logged-in student
 */
function requestProcessed() {
  var roomAssignment = http.get('api/residence/roomAssignment');
  console.log(roomAssignment);
  // The UA100 is a placeholder room that the student is placed in as soon as they submit their deposit
  if (roomAssignment === 'UA100' || roomAssignment === null) {
    return false;
  } else {
    return true;
  }
}

export default {
  requestProcessed,
};
