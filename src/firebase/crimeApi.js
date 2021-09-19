import { getDatabase, ref, push, query, onValue } from "firebase/database";
import { firebaseApp } from "./init";
import { distanceBetween } from "../utils";

/**
 * @typedef {"murder"| "theft"| "Assault"| "Child Abuse"| "Violence"| "Kidnapping"| "Riots"| "burglary"| "cybercrime"| "bombing"| "forgery"| "child trafficing"| "genocide"| "hit and run"| "looting"| "rape"| "smuggling"| "vandalism"| "other"} CrimeType
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
 * Location type.
 * @typedef {Object} Location
 * @property {number} lat - Latitude of the location.
 * @property {number} lng - Longitude of the location.
 */

/**
 * Function to add a crime.
 * @param {{uid: string}} user - The user's id
 * @param {Crime} data - The {@link Crime} data to be added to the database
 * @param {function} onSuccess - The callback function to be called on success
 * @param {function} onError - The callback function to be called on error
 * @returns {void} void
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

/**
 * Function to get all crimes.
 * @param {Location} location - The {@link Location} object.
 * @param {function} onSuccess - The callback function to be called on success
 * @param {function} onError - The callback function to be called on error
 * @returns {function} unsubscribe - The unsubscribe function to be called to
 * unsubscribe from the listener.
 * @example
 * const unsubscribe = getCrimes({lat: 5, lng: 3}, onSuccess, onError);
 */
const getNearbyCrimesListener = (location, onSuccess, onError) => {
  const db = getDatabase(firebaseApp);
  return onValue(
    query(ref(db, "crimes/")),
    (snap) => {
      if (snap.val()) {
        const crimes = snap.val();
        const keys = Object.keys(crimes);

        const crimeData = [];

        for (let i = 0; i < keys.length; i++) {
          const distance = distanceBetween(
            location.lat,
            location.lng,
            crimes[keys[i]].lat,
            crimes[keys[i]].lng
          );
          // 100km.

          if (distance < 100) {
            crimeData.push({ ...crimes[keys[i]], id: keys[i] });
          }
        }
        onSuccess(crimeData);
      } else {
        onSuccess([]);
      }
    },
    onError()
  );
};

/**
 *
 * @param {import('firebase/auth').User} user - The user object.
 * @param {string} crimeId - The crime's id.
 * @param {string} message - The message to be added to the database.
 * @param {function} onSuccess - The callback function to be called on success.
 * @param {function} onError - The callback function to be called on error.
 */
const addMessage = (user, crimeId, message, onSuccess, onError) => {
  const db = getDatabase(firebaseApp);
  push(ref(db, `/messages/${crimeId}`), {
    message: message,
    creator_avatar: user.photoURL,
    creator_name: user.displayName,
    creator_id: user.uid,
    timestamp: Date.now(),
  })
    .then(onSuccess)
    .catch(onError);
};

/**
 *
 * @param {string} crimeId - The crime's id.
 * @param {function} onSuccess - The callback function to be called on success.
 * @param {onError} onError - The callback function to be called on error.
 * @returns {function} unsubscribe - The unsubscribe function to be called to
 * unsubscribe from the listener.
 */
const getMessagesListener = (crimeId, onSuccess, onError) => {
  return onValue(
    query(ref(getDatabase(firebaseApp), `/messages/${crimeId}`)),
    (snap) => {
      if (snap.val()) {
        onSuccess(Object.values(snap.val()));
      } else {
        onSuccess([]);
      }
    },
    onError
  );
};

export { addCrime, getNearbyCrimesListener, addMessage, getMessagesListener };
