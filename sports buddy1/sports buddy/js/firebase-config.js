// ✅ firebase-config.js (Fixed and Enhanced)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getFunctions, connectFunctionsEmulator } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-functions.js";

// ✅ Firebase configuration for Sports Buddy
const firebaseConfig = {
  apiKey: "AIzaSyDOlOWYWI-oP70e4zW16JKsqfb2EdA3Clw",
  authDomain: "sports-buddy-40501.firebaseapp.com",
  projectId: "sports-buddy-40501",
  storageBucket: "sports-buddy-40501.firebasestorage.app",
  messagingSenderId: "1053239701221",
  appId: "1:1053239701221:web:888a1f18567587ff306e0c",
  measurementId: "G-SCCFKTMYCX",
  databaseURL: "https://sports-buddy-40501-default-rtdb.firebaseio.com"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
const functions = getFunctions(app);

// ✅ Enable local session persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("✅ Auth persistence set to local (browserLocalPersistence)");
  })
  .catch((error) => {
    console.error("❌ Error setting auth persistence:", error);
  });

// Optional for emulator testing
// connectFunctionsEmulator(functions, "localhost", 5001);

export { app, auth, db, database, functions };
