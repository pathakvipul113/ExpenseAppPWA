import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

var firebaseConfig = {
    apiKey: "AIzaSyDlnKqb9Cr9ZCn3Y2x9ps8qtSdxxuuLies",
    authDomain: "expenseapp-a2c2c.firebaseapp.com",
    databaseURL: "https://expenseapp-a2c2c.firebaseio.com",
    projectId: "expenseapp-a2c2c",
    storageBucket: "",
    messagingSenderId: "290278117953",
    appId: "1:290278117953:web:d21a28815b93b906"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default firebase;