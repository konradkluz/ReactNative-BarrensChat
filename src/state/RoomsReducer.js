import * as ACTIONS from '../actions/ACTIONS';
import {addRoom} from './utils/';
import _ from 'lodash';

const INITIAL_STATE = {};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case (ACTIONS.CREATE_ROOM):
            return {...state};


        case (ACTIONS.ADD_ROOM):
            return addRoom(state, action);

        case (ACTIONS.UPDATE_USERS_IN_ROOM):
            return Object.assign({}, state, {
                [action.key]: Object.assign({},
                    state[action.key],
                    {
                        usersInRoom: action.snap.val(),
                        numberOfUsersInRoom: Object.keys(action.snap.val() || {}).length
                    })
            });

        case (ACTIONS.REMOVE_ROOM):
            return _.omit(state, [action.key]);
        case (ACTIONS.POPULATING_FIRST_MSG_KEY):
            return _.merge({},
                state, {
                    [action.roomId]: {
                        firstMsgKey: action.firstMsgKey
                    }
                });

        case ACTIONS.SUBSCRIBE_ROOM:
            return _.merge({}, state, {
                [action.roomId]: {
                    isUserSubscribed: action.shouldSubscribe
                }
            });


        case (ACTIONS.INIT_FETCH_MSGS):
            return _.merge({}, state, {
                [action.roomId]: {
                    loadEarlier: action.loadEarlier,
                    initFetchCompleted: true,
                    msgs: action.snap.val()
                }
            });

        case (ACTIONS.FETCH_MSG):
            return _.merge({}, state, {
                [action.roomId]: {
                    msgs: {
                        [action.snap.key]: action.snap.val()
                    }
                }
            });

        case (ACTIONS.STARTED_LOADING_EARLIER_MSGS):
            return _.merge({}, state, {
                [action.roomId]: {
                    isLoadingEarlierMsgs: true
                }
            });


        case (ACTIONS.LOAD_EARLIER_MSGS):
            return _.merge({}, {
                    [action.roomId]: {
                        msgs: action.snap.val()
                    }
                }, state,
                {
                    [action.roomId]: {
                        loadEarlier: action.loadEarlier,
                        isLoadingEarlierMsgs: false
                    }
                });
        default:
            return state;

    }
}



