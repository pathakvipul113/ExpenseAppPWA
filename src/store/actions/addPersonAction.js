export const createPerson = (person) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {

        const firestore = getFirestore();
        console.log(getState())
        // const profile = getState().firebase.profile;
        // const authorId = getState().firebase.auth.uid;

        firestore.collection('persons').add({
            ...person,
            createdAt: new Date(),
        }).then(() => {
            dispatch({ type: 'CREATE_PERSON', person: person })
        }).catch((err) => {
            dispatch({ type: 'CREATE_PERSON_ERROR', person: err })
        })


    }

}