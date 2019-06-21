

const initState = {
    sheetSuccess: null,
    sheetError: null
}

const sheetReducer = (state = initState, action) => {

    switch (action.type) {
        case 'CREATE_SHEET':
            console.log("created successfully", action.sheet)
            return {
                ...state,
                sheetSuccess: 'New Sheet Created successfully',
                sheetError: null

            };
        case 'CREATE_SHEET_ERROR':
            console.log("created error", action.err)
            return {

                sheetError: 'Sheet not created',
                sheetSuccess: null
            };
        default:
            return state;
    }
}

export default sheetReducer