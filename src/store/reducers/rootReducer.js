import sheetReducer from './sheetReducer'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'
import addPerson from './addPersonReducer'


const rootReducer = combineReducers({
    sheet: sheetReducer,
    person: addPerson,
    firestore: firestoreReducer,
    firebase: firebaseReducer
});

export default rootReducer