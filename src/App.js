import React, {useEffect, useState} from 'react'
import './App.css'
import Entry from './Entry'
import fire from './Fire'
import firebase from 'firebase'

function App() {
  // states
  const [user, setUser] = useState('') // google user auth data
  const [profile, setProfile] = useState({}) // firestore user auth data

  // function: if first time logged, create a user doc in firestore
  const initializeUserDataInFireStore = async (user) => {
    if(user.metadata.creationTime===user.metadata.lastSignInTime){
      await fire
        .firestore()
        .collection('users')
        .doc(user.uid)
        .set({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          friends: [],
          status: 'online',
          chatrooms: []
        })
    }
  }
  
  // function: update status to online/offline if not first time logged in
  const updateUserStatusInFirestore = async (user, authAction) => {
    if(user.metadata.creationTime!==user.metadata.lastSignInTime && authAction==='login'){
      await fire
        .firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          status: 'online'
        })
    }
    else if(user.metadata.creationTime!==user.metadata.lastSignInTime && authAction==='logout'){
      await fire
        .firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          status: 'offline'
        })
    }
  }


  // login method
  const login = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    fire
      .auth()
      .signInWithPopup(provider)
      .then((result)=>{
          const user = result.user;
          // if first time logged, create a user doc in firestore
          initializeUserDataInFireStore(user);
          updateUserStatusInFirestore(user, 'login');
          profileListener(user);
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

  // profileSetter
  const profileListener = (user) => {
    fire
      .firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(docSnapshot=>{
        setProfile(docSnapshot.data());
      });
  }

  // logout
  const logout = () => {
    updateUserStatusInFirestore(user, 'logout').then(()=>{
      fire.auth().signOut();
    })
  };

  // functions being run on refresh
  useEffect(()=>{
    authListener();
  }, [])

  return (
    <div className="App">
      {user!=='' ? (
        <div>{profile.displayName}
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
