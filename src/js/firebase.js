import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const config = {
  apiKey: "AIzaSyBEgc7VMkkdDw4YVTlHSwcJZ3_1dIw_BwA",
  authDomain: "myfirebasechatapp-5ba43.firebaseapp.com",
  databaseURL: "https://myfirebasechatapp-5ba43.firebaseio.com",
  projectId: "myfirebasechatapp-5ba43",
  storageBucket: "myfirebasechatapp-5ba43.appspot.com",
  messagingSenderId: "1012451440869"
};

firebase.initializeApp(config)
export const db = firebase.firestore()
const settings = {timestampsInSnapshots: true};
db.settings(settings);

export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const fieldValue = firebase.firestore.FieldValue
