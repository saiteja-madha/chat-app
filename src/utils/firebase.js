import firebase from 'firebase'
import config from '../config';

const firebaseConfig = {
    apiKey: config.FIREBASE.API_KEY,
    authDomain: config.FIREBASE.AUTH_DOMAIN,
    projectId: config.FIREBASE.PROJECT_ID,
    storageBucket: config.FIREBASE.STORAGE_BUCKET,
    messagingSenderId: config.FIREBASE.MESSAGING_ID,
    appId: config.FIREBASE.APP_ID,
    measurementId: config.FIREBASE.MEASUREMENT_ID
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {db, auth, provider};