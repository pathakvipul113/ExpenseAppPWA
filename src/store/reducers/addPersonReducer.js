const initState = {
    personSuccess: null,
    personError: null
}

const personReducer = (state = initState, action) => {

    switch (action.type) {
        case 'CREATE_PERSON':
            console.log("created successfully", action.person)
            return {
                ...state,
                personSuccess: 'New Person Created successfully',
                personError: null

            };
        case 'CREATE_PERSON_ERROR':
            console.log("created error", action.err)
            return {

                personError: 'Person not created',
                personSuccess: null
            };
        default:
            return state;
    }
}

export default personReducer