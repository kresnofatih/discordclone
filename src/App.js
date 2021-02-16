import React, {useEffect, useState} from 'react'
import './App.css'
import Entry from './Entry'
import fire from './Fire'
import firebase from 'firebase'
import Hero from './Hero'

// context to provide profile data
export const ProfileContext = React.createContext() 

// context to provide logout functionality
export const LogoutContext = React.createContext()

function App() {
  // states
  const [user, setUser] = useState('') // google user auth data
  const [profile, setProfile] = useState({}) // firestore user auth data, temporary state

  // function: if first time logged, create a user doc in firestore and auto logout
  const initializeUserDocToFirestore = async (user) => {
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
      });
  }
  
  // function: update status to online/offline if not first time logged in
  const updateUserStatusInFirestore = async (user, authAction) => {
    if(authAction==='login'){
      await fire
        .firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          status: 'online'
        })
    }
    else if(authAction==='logout'){
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
      .then(async(result)=>{
          const user = result.user;
          const userDoc = await fire.firestore().collection('users').doc(""+user.uid).get();
          if(!userDoc.exists){
            setProfile(user);   // sets profile context value
            initializeUserDocToFirestore(user);
            profileListener(user);
          } else {
            updateUserStatusInFirestore(user, 'login');
          }
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
          profileListener(user);
        } else {
          setUser('');
        }
      })
  }

  // profileSetter
  const profileListener = async (user) => {
    const userDoc = await fire.firestore().collection('users').doc(""+user.uid).get(); 
    if(userDoc.exists){ // only start listening if document exists
      fire
        .firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot(docSnapshot=>{
          setProfile(docSnapshot.data());
        });
    }
  }

  // logout
  const logout = () => {
    updateUserStatusInFirestore(user, 'logout').then(()=>{ // set status to offline before logging out
      fire.auth().signOut();
    });
  };

  // functions being run on refresh
  useEffect(()=>{
    authListener();
  }, [])

  return (
    <div className="App">
      {user!=='' ? (
          <ProfileContext.Provider value={profile}>
            <LogoutContext.Provider value={logout}>
              <Hero/>
            </LogoutContext.Provider>
          </ProfileContext.Provider>
      ) : (        
        <Entry login={login}/>
      )}
    </div>
  );
}

export default App;
