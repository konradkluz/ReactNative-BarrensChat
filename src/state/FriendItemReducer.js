import {USER_LOADED, UNLOAD_USER} from "../actions/ACTIONS";
import _ from 'lodash';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case USER_LOADED:
            const {userData} = action;
            return Object.assign({}, state, {
                [userData.uid]: Object.assign({}, state[userData.uid], userData)
            });
        case UNLOAD_USER:
            const {userId} = action;
            return _.omit(state, [userId]);
        default:
            return state;
    }
}