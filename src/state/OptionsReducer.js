import {SET_NOTIFICATIONS, SET_BACKGROUNDGEO} from '../actions/ACTIONS';
import {NOTIF_TYPES} from './../utils/Notifications';
import {REHYDRATE} from 'redux-persist/constants'
import _ from 'lodash';

const INITIAL_STATE = {
    notifications: {
        globalSetting: true,
        [NOTIF_TYPES.newPublicMsg]: true,
        [NOTIF_TYPES.newPrivateMsg]: true,
        [NOTIF_TYPES.newInvitationToFriends]: true,
        [NOTIF_TYPES.newRoomInDistance]: true
    },
    bgGeo: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REHYDRATE:
            const savedOptions = action.payload.options;
            if (savedOptions) return {...state, ...savedOptions};
            return state;
        case SET_NOTIFICATIONS: {
            INITIAL_STATE.notifications[action.notifType] = action.isEnabled;

            return (_.merge({}, state,
                    {
                        notifications: {
                            [action.notifType]: action.isEnabled
                        }
                    }
                )
            )
        }
        case SET_BACKGROUNDGEO:
            INITIAL_STATE.bgGeo = action.isEnabled;
            return {...state, bgGeo: action.isEnabled};
        default:
            return state

    }

};