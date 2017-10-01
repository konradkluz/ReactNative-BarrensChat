import * as ACTIONS from '../actions/ACTIONS';


export default (state = {isConnected:null}, action) => {
    switch (action.type) {

        case ACTIONS.SET_CONNECTION_STATE:
            return {isConnected : action.isConnected};

        default:
            return state;
    }

}