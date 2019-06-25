

const initState = {
    expenseSuccess: null,
    expenseError: null
}

const expenseReducer = (state = initState, action) => {

    switch (action.type) {
        case 'CREATE_EXPENSE':
            console.log("created successfully", action.expense)
            return {
                ...state,
                expenseSuccess: 'New expense Created successfully',
                expenseError: null

            };
        case 'CREATE_EXPENSE_ERROR':
            console.log("created error", action.err)
            return {

                expenseError: 'expense not created',
                expenseSuccess: null
            };
        default:
            return state;
    }
}

export default expenseReducer