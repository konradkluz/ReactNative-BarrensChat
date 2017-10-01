import * as ACTIONS from '../actions/ACTIONS';
import {REHYDRATE} from 'redux-persist/constants'


const INITIAL_STATE = {
    email: '',
    password: '',
    error: '',
    user: null,
    loading: false,
    authProvider: null
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REHYDRATE:
            const savedOptions = action.payload.auth;
            if (savedOptions) return {...state, authProvider: savedOptions.authProvider};
            return state;
        case ACTIONS.EMAIL_CHANGED:
            return {...state, email: action.payload};

        case ACTIONS.PASSWORD_CHANGED:
            return {...state, password: action.payload};

        case ACTIONS.LOGIN_USER:
            return {...state, loading: true, error: ''};

        case ACTIONS.LOGIN_USER_SUCCESS:
            console.log('User logs in');
            return {...state, user: action.payload, error: '', loading: false, email: '', password: ''};
        case ACTIONS.SET_AUTH_PROVIDER:
            return {...state, authProvider: action.authProvider};
        case ACTIONS.UPDATE_USER:
            return {...state, user: action.user};

        case ACTIONS.LOGIN_USER_FAILED:
            return {...state, error: action.payload, email: '', password: '', loading: false};

        case ACTIONS.LOGOUT:
            return {...INITIAL_STATE};


        default:
            return state;

    }
}