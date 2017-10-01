import {
    SET_APP_STATE,
    FIREBASE_INITIALIZED
} from "../actions/ACTIONS";

const INITIAL_STATE = {
    appState: 'active',
    firebaseInitialized: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_APP_STATE:
            return {...state, appState: action.appState};
        case FIREBASE_INITIALIZED:
            return {...state, firebaseInitialized: action.firebaseInitialized};
        default:
            return state;
    }
}