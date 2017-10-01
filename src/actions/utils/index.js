import _ from 'lodash';
import * as firebase from 'firebase';
import {PUBLIC_ROOMS_REF, USERS_IN_ROOM} from '../DbRefsConst'

export const checkIsUserSubscribed = (user, key) => {
    return !_.isEmpty(_(user.subscribedRooms || {}).pick(key).value());
};

export function writeToActiveUsersInRoom(currentUser, roomId) {
    const roomRef = firebase.database().ref(PUBLIC_ROOMS_REF).child(roomId);
    const roomUsersRef = roomRef.child(USERS_IN_ROOM).child(currentUser.uid);
    const lastActivity = firebase.database.ServerValue.TIMESTAMP;

    roomUsersRef.set(
        {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            lastActivity
        });
}

export * from './FCMToken';
