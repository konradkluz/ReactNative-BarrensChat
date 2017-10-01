import * as ACTIONS from '../actions/ACTIONS';

const INITIAL_STATE = {
    coords: undefined
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type){

        case ACTIONS.SET_POSITION:
            return {...action.pos};

        default:
            return state;
    }
}