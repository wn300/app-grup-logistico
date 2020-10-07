import firebase from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyDTfTJOKVWZ0vHhkSOyCL3b-IH2AYjm_fo",
    authDomain: "app-logistica-e66c8.firebaseapp.com",
    databaseURL: "https://app-logistica-e66c8.firebaseio.com",
    projectId: "app-logistica-e66c8",
    storageBucket: "app-logistica-e66c8.appspot.com",
    messagingSenderId: "281146804533",
    appId: "1:281146804533:web:308c74aafa8f5f2723247c"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);