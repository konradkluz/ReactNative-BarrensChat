import * as ACTIONS from '../ACTIONS';
import * as firebase from 'firebase';
import {USERS_IN_ROOM, PUBLIC_ROOMS_REF} from './../DbRefsConst';
import store from './../../store';
import {leaveRoom, joinRoom} from '../RoomActions';
import notif from './../../utils/Notifications';
import {checkIsUserSubscribed} from '../utils/';


function initRoomInRadiusObserver(dispatch, geoQuery) {
    const roomsRef = firebase.database().ref(PUBLIC_ROOMS_REF);

    dispatchLoadingState(dispatch, geoQuery);

    let userListener = onRoomEnteringRadiusAdd(dispatch, geoQuery, roomsRef);

    onRoomLeavingDistanceRemove(dispatch, geoQuery, roomsRef, userListener);
}


function onRoomEnteringRadiusAdd(dispatch, geoQuery, roomsRef) {
    let userListener;
    geoQuery.on("key_entered", (key) => {
        let roomLoaded = false;
        userListener = roomsRef.child(key).child(USERS_IN_ROOM).on('value', snap => {
            if (!roomLoaded) return;
            dispatch({type: ACTIONS.UPDATE_USERS_IN_ROOM, snap, key});
        });

        roomsRef.child(key).once('value', snap => {
            roomLoaded = true;
            addRoomAndJoinIfSubscribed(dispatch, snap);
        });
    });
    return userListener;
}

function addRoomAndJoinIfSubscribed(dispatch, snap) {
    const user = store.getState().auth.user;
    const isUserSubscribed = checkIsUserSubscribed(user, snap.key);
    dispatch({type: ACTIONS.ADD_ROOM, roomProps: snap.val(), roomId: snap.key, isUserSubscribed});
    if (isUserSubscribed) {
        joinRoom(user, snap.key, 'public')(store.dispatch, store.getState);
        notif.subscribedRoomInDistance(snap.val().title);
    } else {
        notif.newRoomInDistance(snap.val().title);
    }
}

function onRoomLeavingDistanceRemove(dispatch, geoQuery, roomsRef, userListener) {
    geoQuery.on("key_exited", (key) => {
        roomsRef.child(key).child(USERS_IN_ROOM).off('value', userListener);
        leaveRoom(key);
        dispatch({type: ACTIONS.REMOVE_ROOM, key});
    });
}

//todo this causes fuking bug
function dispatchLoadingState(dispatch, geoQuery) {
    let readyCallback;

    new Promise((resolve, reject) =>
        readyCallback = geoQuery.on("ready", () => {
                dispatch({type: ACTIONS.LOADING_ROOMS_ENDED});
                resolve();
            }
        )).then(() => readyCallback.cancel());
}


export default initRoomInRadiusObserver;