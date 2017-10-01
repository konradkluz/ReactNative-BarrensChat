import * as ACTIONS from '../actions/ACTIONS';
import _ from 'lodash';
import {addRoom} from './utils/';



export default (state = {}, action) => {
    switch (action.type) {

        case ACTIONS.ADD_ROOM_LOCATION:
            return addRoom(state, action);

        case ACTIONS.REMOVE_ROOM_LOCATION:
            return _.omit(state, [action.key]);

        case ACTIONS.CLEAR_ROOM_LOCATION:
            return {};

        default:
            return state;
    }
}