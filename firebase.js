import { initializeApp } from "firebase/app";
import { getDatabase, set, push } from "firebase/database";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadString,
} from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-ajAQ1iDfhswiEZFh5MFoss44SjibteM",
  authDomain: "petcareproject-e2cb7.firebaseapp.com",
  databaseURL: "https://petcareproject-e2cb7-default-rtdb.firebaseio.com",
  projectId: "petcareproject-e2cb7",
  storageBucket: "petcareproject-e2cb7.appspot.com",
  messagingSenderId: "295400947596",
  appId: "1:295400947596:web:af2186ca116e827227e0a9",
  measurementId: "G-GG6C1HM6TZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(app);

// Khởi tạo các dịch vụ Firebase cần sử dụng
const storage = getStorage(app);
const database = getDatabase(app);
// const auth = auth(app);

export { storage, database };
