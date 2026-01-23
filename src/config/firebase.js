import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAA2wnefOj9KI9YDe8OJoaGsdCJ3KWkH8U",
  authDomain: "projectapqi-web.firebaseapp.com",
  projectId: "projectapqi-web",
  storageBucket: "projectapqi-web.firebasestorage.app",
  messagingSenderId: "837087733188",
  appId: "1:837087733188:web:e5ace9d263148a39453091",
  measurementId: "G-FT1LCDKHVH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);