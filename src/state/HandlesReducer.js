import * as ACTIONS from '../actions/ACTIONS';
import _ from 'lodash';


const INITIAL_STATE = {
    geoQuery: {},
    locationCallback: {}
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {

        case(ACTIONS.SET_GEOQUERY_ID):
            return _.merge({}, state, {
                    geoQueries: {
                        [action.roomType]: action.geoQuery
                    }
                }
            );

        case(ACTIONS.SET_LOCATION_CALLBACK):
            console.log(action.locationCallback, action.roomType)
            return _.merge({}, state,
                {
                    locationCallbacks: {
                        [action.roomType]: action.locationCallback
                    }
                }
            );

        case(ACTIONS.HANDLES_DEINITIALIZED):
            return {};

        default:
            return state;

    }
}