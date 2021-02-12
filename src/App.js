import React, {useEffect, useState} from 'react'
import './App.css'
import Entry from './Entry'
import fire from './Fire'
import firebase from 'firebase'

function App() {
  // state
  const [user, setUser] = useState('')

  // login
  const login = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    fire
      .auth()
      .signInWithPopup(provider)
      .then((result)=>{
          const token = result.credential.accessToken;
          const user = result.user;
      })
      .catch((error)=>{
          console.log(error);
      });
  }

  // authlistener
  const authListener = () => {
    fire
      .auth()
      .onAuthStateChanged((user)=>{
        if(user){
          setUser(user);
        } else {
          setUser('');
        }
      })
  }

  // logout
  const logout = () => {
    fire.auth().signOut();
  };

  // authlistener on refresh
  useEffect(()=>{
    authListener();
  }, [])

  return (
    <div className="App">
      {user!=='' ? (
        <div>logged in
          <button
            onClick={logout}
          >logout</button>
        </div>
      ) : (        
        <Entry login={login}/>
      )}
    </div>
  );
}

export default App;
