import * as ACTIONS from '../actions/ACTIONS';

INITIAL_STATE = {
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case ACTIONS.SET_REGION:
            return ({...action.region});

        default:
            return state;
    }


}