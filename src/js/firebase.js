import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

firebase.initializeApp(config)
export const db = firebase.firestore()
const settings = {timestampsInSnapshots: true};
db.settings(settings);

export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const fieldValue = firebase.firestore.FieldValue
