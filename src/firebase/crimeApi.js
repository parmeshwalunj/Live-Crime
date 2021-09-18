import { getDatabase, ref, push, query, onValue } from "firebase/database";
import { firebaseApp } from "./init";
import { distanceBetween } from "../utils";

/**
 * @typedef {"robbing" | "murder" | "traffic" | "kidnapping" | "fire"} CrimeType
 */

/**
 * Crime type.
 * @typedef {Object} Crime
 * @property {string} description - The description user gave.
 * @property {CrimeType} type - The type of crime.
 * @property {number} severity - Severity of crime.
 * @property {number} timestamp - Time of crime / Time of upload.
 * @property {number} upvotes - "Upvotes" of crime.
 * @property {number} downvotes - "Downvotes" of crime.
 * @property {number} landmark - Landmark of the crime provided by the use.
 * @property {number} lat - "Latitude of the crime.
 * @property {number} lng - "Langitude of the crime location.
 */

/**
 * Function to add a crime.
 * @param {{uid: string}} user - The user's id
 * @param {Crime} data - The {@link Crime} data to be added to the database
 * @param {function} onSuccess - The callback function to be called on success
 * @param {function} onError - The callback function to be called on error
 * @returns {void}
 *
 */
const addCrime = (user, data, onSuccess, onError) => {
  const db = getDatabase(firebaseApp);
  push(ref(db, "crimes/"), {
    ...data,
    creator_id: user.uid,
  })
    .then((ref) => onSuccess(ref))
    .catch(onError);
};

const getNearbyCrimesListener = (location, onSuccess, onError) => {
  const db = getDatabase(firebaseApp);
  onValue(
    query(ref(db, "crimes/")),
    (snap) => {
      if (snap.val()) {
        const crimes = snap.val();
        const crimeData = [];
        for (const crime of crimes) {
          const distance = distanceBetween(
            location.lat,
            location.lng,
            crime.lat,
            crime.lng
          );
          // 100km.
          if (distance < 100) {
            crimeData.push(crime);
          }
        }
        onSuccess(crimeData);
      } else {
        onSuccess([]);
      }
    },
    onError
  );
};

export { addCrime, getNearbyCrimesListener };
