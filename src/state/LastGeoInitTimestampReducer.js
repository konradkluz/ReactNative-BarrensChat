import * as ACTIONS from '../actions/ACTIONS';




const INITIAL_STATE = null;



export default (state = INITIAL_STATE, action) => {
    switch (action.type) {


        case ACTIONS.SET_LAST_GEOINIT_TIMESTAMP:
            return action.timestamp;


        default:
            return state;


    }

}