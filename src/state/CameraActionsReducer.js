import {SEND_PICTURE, PICTURE_SENT} from '../actions/ACTIONS';

const INITIAL_STATE = {
    url: ''
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type){
        case SEND_PICTURE:
            return {url: action.payload};
        case PICTURE_SENT:
            return INITIAL_STATE;
        default:
            return state;
    }
}

