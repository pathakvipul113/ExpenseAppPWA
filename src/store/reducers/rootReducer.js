import sheetReducer from './sheetReducer'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'
import addPerson from './addPersonReducer'
import expenseReducer from './expenseReducer'


const rootReducer = combineReducers({
    sheet: sheetReducer,
    person: addPerson,
    firestore: firestoreReducer,
    firebase: firebaseReducer,
    expense: expenseReducer
});

export default rootReducer