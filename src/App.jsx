import { useState, useEffect } from "react";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import { db, auth, google } from "../firebase.ts";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { signInWithPopup, signOut } from "firebase/auth";
import { updateDoc } from "firebase/firestore"; // make sure this is imported

function App() {
  const [count, setCount] = useState(0);
  const [doc, setDoc] = useState(null);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const loadCollection = async () => {
      const collectionRef = collection(db, "test");
      const snap = await getDocs(collectionRef);

      if(snap.empty) {
        console.log("No documents found");
      }

      if(snap.docs.length > 1){
        console.log("More than one document found");
      }
      
      const firstDoc = snap.docs[0];
      setCount(firstDoc.data().count);
      setDoc(firstDoc);
    };
    loadCollection();
  }, []);

  const handleAuthClick = () => {
    if(user) {
      signOut(auth).catch(console.error);
      setUser(null);
    }
    else {
      signInWithPopup(auth, google)
      .then((result) => setUser(result.user))
      .catch(console.error);
    }
  }

  useEffect(() => {
    if (!doc) {
      addDoc(collection(db, "test"), {
        uid: "test",
        createdAt: new Date(),
        count,
      });
    }
    else {
      const docRef = doc.ref;
      updateDoc(docRef, {
         count 
      });
    }
  },[doc, count]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <button onClick={handleAuthClick}>{user ? "sign out": "sign in"}</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
