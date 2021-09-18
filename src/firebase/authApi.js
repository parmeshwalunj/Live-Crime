import {
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  signOut as firebaseSignOut,
  
}from "firebase/auth";
import {firebaseApp} from "./init"
export const signInWithGoogle = (onSuccess, onError) => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(firebaseApp);
  // auth().useDeviceLanguage();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      onSuccess(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      onError(errorCode, errorMessage);
    });
};

export const signOut = (onSuccess, onError) => {
  firebaseSignOut(getAuth()).then(onSuccess).catch(onError);
};
