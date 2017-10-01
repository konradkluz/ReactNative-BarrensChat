import _ from 'lodash';
import GpsService from '../../utils/geo';
import * as ACTIONS from '../ACTIONS';
import {leaveRoom} from './../RoomActions';
import * as firebase from 'firebase';
import {unInitDeviceLocationUpdater} from './deviceLocationUpdater';
import {PUBLIC_ROOMS_REF} from '../DbRefsConst';
import {deinitAppStateListener} from './appState';


function deinitialize(dispatch, state) {
    //deinitializer sometimes calls twice
    _.forEach(state.handles.geoQueries, query => query && query.cancel());
    unInitDeviceLocationUpdater(state);
    GpsService.stop();
    removeRooms(dispatch, state);
    deinitAppStateListener();
    dispatch({type: ACTIONS.HANDLES_DEINITIALIZED})
}

function removeRooms(dispatch, state) {
    const ref = firebase.database().ref();
    _.forEach(state.rooms, (value, roomId) => {
        ref.child(`${PUBLIC_ROOMS_REF}/${roomId}/usersInRoom/`).off();
        leaveRoom(roomId);
        dispatch({type: ACTIONS.REMOVE_ROOM, key: roomId})
    });
}

export default deinitialize;
