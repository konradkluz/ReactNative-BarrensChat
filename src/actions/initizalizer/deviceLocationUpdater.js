import GpsService from '../../utils/geo';
import * as ACTIONS from '../ACTIONS';
import _ from 'lodash';


export const initDeviceLocationUpdater = (dispatch, geoQuery, roomType) => {
    const locationCallback = updateQueryOnMove(geoQuery);
    GpsService.on('location', locationCallback);
    dispatch({type: ACTIONS.SET_LOCATION_CALLBACK, locationCallback, roomType});
};

export function unInitDeviceLocationUpdater(state) {
    _.forEach(state.handles.locationCallbacks, callback => {
        GpsService.un('location', callback)
    });
}


function updateQueryOnMove(geoQuery) {
    return (pos) => {
        geoQuery.updateCriteria({
                center: [pos.coords.latitude, pos.coords.longitude]
            },
            geoQuery.radius()
        )
    }
}
