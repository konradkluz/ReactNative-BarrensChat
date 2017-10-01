import GeoFire from 'geofire';
import * as ACTIONS from './ACTIONS';
import {PUBLIC_ROOMS_REF, ALL_ROOMS_LOC_REF} from './DbRefsConst';
import * as firebase from "firebase";
import {checkIsUserSubscribed} from './utils';
import store from '../store';
import _ from 'lodash';


let geoQuery;
let unsubscribeUpdateRoomMapQuery;
let isAlreadyInitialized = false;
let stopInitializing = true;

export const initRoomMapQuery = () => {

    stopInitializing = false;

    return (dispatch, getState) => {


        if (!getState().position.coords) {
            const unsubscribe = store.subscribe(() => {
                const coords = getState().position.coords;
                if (coords) {
                    unsubscribe();
                    if (!isAlreadyInitialized && !stopInitializing) {
                        initQuery(dispatch, getState, coords.latitude, coords.longitude);
                    }
                }
            })
        } else {
            const {latitude, longitude} = getState().position.coords;
            initQuery(dispatch, getState, latitude, longitude);
        }

    }
};

function initQuery(dispatch, getState, latitude, longitude) {
    isAlreadyInitialized = true;


    const region = {
        latitude,
        longitude,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0321,
    };

    dispatch({type: ACTIONS.SET_REGION, region});
    const geoQueryRef = new GeoFire(firebase.database().ref(ALL_ROOMS_LOC_REF));
    const roomsRef = firebase.database().ref(PUBLIC_ROOMS_REF);
    geoQuery = geoQueryRef.query({
        center: [latitude, longitude],
        radius: 5,
    });

    geoQuery.on("key_entered", (key) => {
            const user = getState().auth.user;
            roomsRef.child(key).on('value', (snap) => {
                const isUserSubscribed = checkIsUserSubscribed(user, snap.key);
                dispatch({type: ACTIONS.ADD_ROOM_LOCATION, roomProps: snap.val(), roomId: key, isUserSubscribed})
            })
        }
    );

    geoQuery.on('key_exited', (key) => {
        roomsRef.child(key).off();
        dispatch({type: ACTIONS.REMOVE_ROOM_LOCATION, key})
    });

    updateRoomMapQuery(getState);

}

export const deinitRoomMapQuery = () => {
    isAlreadyInitialized = false;
    stopInitializing = true;
    unsubscribeUpdateRoomMapQuery();
    if (geoQuery) {
        geoQuery.cancel();
    }
    return (dispatch) => {
        dispatch({type: ACTIONS.CLEAR_ROOM_LOCATION})
    }
};

const updateRoomMapQuery = (getState) => {
    let currRegion;
    unsubscribeUpdateRoomMapQuery = store.subscribe(() => {
        let prevRegion = currRegion;
        currRegion = getState().region;
        //check if curr coords aren't undefined
        if (!_.isEqual(prevRegion, currRegion)) {
            if (!_.isEmpty(currRegion)) {
                console.log(currRegion);
                const {latitude, longitude, latitudeDelta, longitudeDelta} = currRegion;
                const latitudeCircumference = 40075 * Math.cos(latitude * Math.PI / 180);
                let queryRadius = _.min([longitudeDelta * latitudeCircumference / 360, latitudeDelta * 40008 / 360]);
                queryRadius = queryRadius < 50 ? queryRadius : 50;

                geoQuery.updateCriteria({
                        center: [latitude, longitude],
                        radius: queryRadius
                    },
                )
            }
            console.log(geoQuery.radius());
        }
    });


};



