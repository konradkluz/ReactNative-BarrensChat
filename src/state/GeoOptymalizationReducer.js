import * as ACTIONS from '../actions/ACTIONS';
import _ from 'lodash';
import GeoFire from 'geofire';


const INITIAL_STATE = {
    roomDistances: {},
    optimalBgDistanceFilter: 100,
};

export default (state = INITIAL_STATE, action) => {

    switch (action.type) {

        case ACTIONS.ADD_GEOOPTYMALIZATION_PIVOT:
            return addGeoOptymalizationPivot(state, action.roomId, action.distance, action.location, action.roomRadius);


        case ACTIONS.REMOVE_GEOOPTYMALIZATION_PIVOT:
            return removeGeoOptimalizationPivot(state, action.roomId);


        case ACTIONS.RECALCUlATE_OPTIMAL_DISTANCE_FILTER:
            return recalculateOptimalBgDistanceFilter(state, action.coords);

        default:
            return state;

    }
}


function addGeoOptymalizationPivot(state, roomId, distance, location, radius) {
    const roomDistances = Object.assign({}, {...state.roomDistances}, {[roomId]: {distance, location, radius}});
    const optimalBgDistanceFilter = calculateOptimalBgDistanceFilter(roomDistances);
    return {
        roomDistances,
        optimalBgDistanceFilter
    }
}


function removeGeoOptimalizationPivot(state, roomId) {
    const roomDistances = _.omit(state.roomDistances, [roomId]);
    const optimalBgDistanceFilter = calculateOptimalBgDistanceFilter(roomDistances);
    return {
        roomDistances,
        optimalBgDistanceFilter
    }
}



function calculateOptimalBgDistanceFilter(roomDistances) {
    let minimalDistance = _(roomDistances)
        .reduce(calculateMinimalDistance, 1000);
    console.log('Minimal distance', minimalDistance);
    return minimalDistance > 30 ? minimalDistance : 30;
    
}

function calculateMinimalDistance(minDistance, room) {
    const distanceToRoom = Math.abs(room.distance - room.radius) * 1000;
    return minDistance < distanceToRoom ? minDistance : distanceToRoom;
}


function recalculateOptimalBgDistanceFilter(state, currCoords) {
    const currLocation = [currCoords.latitude, currCoords.longitude];
    const roomDistances = _(state.roomDistances)
        .mapValues(roomDistances => {
            const distance = GeoFire.distance(currLocation, roomDistances.location);
            return {distance, location: roomDistances.location, radius: roomDistances.radius};
        }).value();
    const optimalBgDistanceFilter = calculateOptimalBgDistanceFilter(roomDistances);

    return {
        roomDistances,
        optimalBgDistanceFilter,
    }

}




