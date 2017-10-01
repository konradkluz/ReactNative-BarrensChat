import store from '../../store';
import GpsService from '../../utils/geo';
import GeoFire from 'geofire';
import RoomTypes from './ROOM_TYPE';
import {ALL_ROOMS_LOC_REF, PUBLIC_ROOMS_REF} from '../DbRefsConst';
import * as firebase from "firebase";
import * as ACTIONS from '../ACTIONS';

let geoQuery;
let cancelReady;


export function initGeoOptymalizationQuery() {
    const geoQueryRef = new GeoFire(firebase.database().ref(ALL_ROOMS_LOC_REF));
    const roomsRef = firebase.database().ref(PUBLIC_ROOMS_REF);

    const {latitude, longitude} = store.getState().position.coords || {latitude: 0, longitude: 0};
    geoQuery = geoQueryRef.query({
        center: [latitude, longitude],
        radius: 1,
    });

    geoQuery.on('key_entered', (roomId, location, distance) => {
            let roomType;
            roomsRef.child(roomId).child('roomType').once("value", (roomTypeSnap) => {
                roomType = roomTypeSnap.val();
            }).then(() => store.dispatch({
                type: ACTIONS.ADD_GEOOPTYMALIZATION_PIVOT,
                roomId,
                location,
                distance,
                roomRadius: RoomTypes[roomType].radius
            }))

        }
    );

    geoQuery.on('key_exited', roomId => store.dispatch({type: ACTIONS.REMOVE_GEOOPTYMALIZATION_PIVOT, roomId}));

    GpsService.on('location', optimalizeGeo)


}

export function deinitGeoOptimalizationQuery() {
    GpsService.un('location', optimalizeGeo);
    geoQuery.cancel();
}


function optimalizeGeo(pos) {
    if(store.getState().appState.appState === 'background') {
        updateGeoOptymalizationQuery(pos).then(() => {
            console.log('Geo optymalized');
            cancelReady.cancel();
            store.dispatch({type: ACTIONS.RECALCUlATE_OPTIMAL_DISTANCE_FILTER, coords: pos.coords});
            changeGpsConfig();
        })
    }

}


function changeGpsConfig() {
    GpsService.setConfig({
        distanceFilter: store.getState().geoOptymalization.optimalBgDistanceFilter
    })
}

function updateGeoOptymalizationQuery({coords: {latitude, longitude}}) {
    return new Promise((resolve, reject) => {
        geoQuery.updateCriteria({
            center: [latitude, longitude]
        });
        cancelReady = geoQuery.on('ready', () => {
            resolve();
        })

    })
}