import * as ACTIONS from '../actions/ACTIONS'

const INITIAL_STATE = {
  createRoomCollapsed: true
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case ACTIONS.TOOGLE_ROOM_CREATION:
            return {...state, createRoomCollapsed: action.collapsed};

        default:
            return state;
    }

}