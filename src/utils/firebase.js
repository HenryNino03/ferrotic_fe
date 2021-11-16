import { initializeApp } from "firebase/app";

import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCU-2_1f8gm6DFqlXalRknuxPYSg91mPjM",
  authDomain: "proyecto-24355.firebaseapp.com",
  databaseURL: "https://proyecto-24355.firebaseio.com",
  projectId: "proyecto-24355",
  storageBucket: "proyecto-24355.appspot.com",
  messagingSenderId: "968755778824",
  appId: "1:968755778824:web:b46bd553c5d7d85885c8bd",
  measurementId: "G-QQ4KDFF38C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Storage
const storage = getStorage(app);

export { storage, ref, getDownloadURL, uploadBytes };
