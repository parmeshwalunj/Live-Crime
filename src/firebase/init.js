import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD3sltzvB_-QarROanBcW4hbfMkPr4g_Gk",
  authDomain: "crime-reporter-d69b0.firebaseapp.com",
  projectId: "crime-reporter-d69b0",
  storageBucket: "crime-reporter-d69b0.appspot.com",
  messagingSenderId: "24643872677",
  appId: "1:24643872677:web:a8a8bb5a74a304d6ceaa4c",
  databaseURL:
    "https://crime-reporter-d69b0-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export { firebaseApp };
