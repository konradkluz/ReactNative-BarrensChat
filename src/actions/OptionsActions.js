import * as ACTIONS from "./ACTIONS";
import {updateNotifSettings} from './utils';


export const setNotifications = (notifType, isEnabled) => {

    return (dispatch, getState) => {
        const currFCMToken = getState().FCMToken;
        updateNotifSettings(currFCMToken, notifType, isEnabled)
            .then(() => dispatch({type: ACTIONS.SET_NOTIFICATIONS, notifType, isEnabled}));
    }
};


export const setBackgroundGeo = (isEnabled) => {
    return (dispatch) => {
        dispatch({type: ACTIONS.SET_BACKGROUNDGEO, isEnabled})
    }
};