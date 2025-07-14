import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcO3DEzmWKG7KvTOgDRbYuCCY_WAJZWg0",
  authDomain: "vibexcode.firebaseapp.com",
  projectId: "vibexcode",
  storageBucket: "vibexcode.firebasestorage.app",
  messagingSenderId: "172829447318",
  appId: "1:172829447318:web:071dbdec7f8938d7cb5eb7",
  measurementId: "G-GMZT6RY5N5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure providers with proper scopes
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");

const githubProvider = new GithubAuthProvider();
githubProvider.addScope("user:email");
githubProvider.addScope("read:user");

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope("email");

export {
  app,
  auth,
  googleProvider,
  githubProvider,
  facebookProvider,
  signInWithPopup,
};
