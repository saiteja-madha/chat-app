export const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    roomData: null
};

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_ROOMDATA: "SET_ROOMDATA",
};

const reducer = (state, action) => {
    switch(action.type) {

        case actionTypes.SET_USER:
            localStorage.setItem("user", JSON.stringify(action.user));
            return {
                ...state,
                user: action.user
            }

        case actionTypes.SET_ROOMDATA:
            return {
                ...state,
                roomData: action.roomData
            }

        default:
            return state;
    }
}

export default reducer;