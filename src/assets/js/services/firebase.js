// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// NOTE: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyD35k0SDHOisZjJeSzYYYQNruGl4fNDOiE',
  authDomain: 'news-dapp.firebaseapp.com',
  projectId: 'news-dapp',
  storageBucket: 'news-dapp.appspot.com',
  messagingSenderId: '462605202692',
  appId: '1:462605202692:web:a2c54721225c9278f78c51',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
