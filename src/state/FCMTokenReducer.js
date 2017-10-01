

import {SET_FCM_TOKEN} from "../actions/ACTIONS";



export default (state = "", action) => {
    switch (action.type){

        case SET_FCM_TOKEN:
            return  action.FCMToken;

        default:
            return state;
    }
}

