import moment from 'moment'
export const createExpense = (expense) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {

        const firestore = getFirestore();

        console.log(getState());
        console.log(expense);
        firestore.collection('sheets')
            .doc(expense.docId)
            .update({
                ['expense ' + expense.date]: {
                    description: expense.description,
                    date: expense.date,
                    amount: expense.amount,
                    paidBy: expense.paidBy,
                    items: expense.items
                }
            }).then(() => {
                dispatch({ type: 'CREATE_EXPENSE', expense: expense })
            }).catch((err) => {
                dispatch({ type: 'CREATE_EXPENSE_ERROR', expense: err })
            })


    }

}