import { useState, useEffect } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";

import monkeImage1 from "./assets/serious-monke.jpg.webp";
import monkeImage2 from "./assets/happy-monke.jpg.webp";

import "./App.css";

import { db, auth, google } from "../firebase.ts";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { signInWithPopup, signOut } from "firebase/auth";

function App() {
  const [count, setCount] = useState(0);
  const [docRef, setDocRef] = useState(null);
  const [user, setUser] = useState(null);

  const testDocRef = doc(db, "test", "single-document");

  // handling change of image with count
  let currentImage = monkeImage1;
  if (count > 20) currentImage = monkeImage2;

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const docSnap = await getDoc(testDocRef);
        if (docSnap.exists()) {
          setCount(docSnap.data().count || 0);
          setDocRef(testDocRef);
        } else {
          await setDoc(testDocRef, { 
            uid: "test", 
            createdAt: new Date(), 
            count: 0 
          });
          setCount(0);
          setDocRef(testDocRef);
        }
      } catch (error) {
        console.error("Error loading document:", error);
      }
    };

    loadDocument();
  }, []);

  const handleAuthClick = () => {
    if (user) {
      signOut(auth).catch(console.error);
      setUser(null);
    } else {
      signInWithPopup(auth, google)
        .then((result) => setUser(result.user))
        .catch(console.error);
    }
  };

  // adding the option to reset the counter by deleting the doc
  const handleDelete = async () => {
    // adding a message for when user tries to reset and counter = 0
    if(count === 0) {
      alert("Already at 0!");
      return;
    }

    if (docRef) {
    await deleteDoc(docRef);
    setDocRef(null);
    setCount(0);

    // creating a new document when deletion occurs
    const docSnap = await getDoc(testDocRef);
    if (!docSnap.exists()) {
      await setDoc(testDocRef, { 
        uid: "test", 
        createdAt: new Date(), 
        count: 0 
      });
      setCount(0);
      setDocRef(testDocRef);
    }
  }
};

  useEffect(() => {
    if (!docRef) return;
    const updateCount = async () => {
      try {
        await updateDoc(docRef, { count });
      } catch (error) {
        console.error("Error updating count:", error);
      }
    };
    updateCount();
  }, [docRef, count]);

  return (
    <>
      <div>
        <img src={currentImage} alt="Button image" className="logo" />
      </div>
      <h1>Count is {count}</h1>
      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>Increase Count</button>
        <button onClick={handleDelete}>{"Reset Count"}</button>
        <button onClick={handleAuthClick}>{user ? "Sign out" : "Sign in"}</button>
      </div>
      <p className="read-the-docs">Click the counter!</p>
    </>
  );
}

export default App;
