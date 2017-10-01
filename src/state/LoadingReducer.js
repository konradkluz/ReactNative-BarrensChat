import * as ACTIONS from '../actions/ACTIONS';

const INITIAL_STATE = {
    loadingRooms: true
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case (ACTIONS.LOADING_ROOMS_STARTED):
            return {loadingRooms: true};

        case (ACTIONS.LOADING_ROOMS_ENDED):
            return {loadingRooms: false};

        default:
            return state;

    }
}