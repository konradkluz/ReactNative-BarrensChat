import {CLOSE_DRAWER, OPEN_DRAWER} from "../actions/ACTIONS";

const INITIAL_STATE = {
    isOpen: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case OPEN_DRAWER:
            return {isOpen: true};
        case CLOSE_DRAWER:
            return {isOpen: false};
        default:
            return state;
    }
}

