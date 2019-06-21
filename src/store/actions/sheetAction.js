

export const createSheet = (sheet) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {

        const firestore = getFirestore();
        // const profile = getState().firebase.profile;
        // const authorId = getState().firebase.auth.uid;

        firestore.collection('sheets').add({

            ...sheet,
            authorFirstName: "Vipul",
            authorLastName: "Pathak",
            authorId: "123",
            createdAt: new Date(),
        }).then(() => {
            dispatch({ type: 'CREATE_SHEET', sheet: sheet })
        }).catch((err) => {
            dispatch({ type: 'CREATE_SHEET_ERROR', sheet: err })
        })


    }

}