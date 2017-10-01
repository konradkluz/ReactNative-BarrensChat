import * as ACTIONS from "./ACTIONS";
import * as firebase from "firebase";
import _ from "lodash";
import GeoFire from "geofire";
import GpsService from "../utils/geo";
import ROOM_TYPE from "./initizalizer/ROOM_TYPE";
import {
    ALL_ROOMS_LOC_REF,
    MESSAGES_REF,
    PRIVATE_ROOMS_REF,
    PUBLIC_ROOMS_REF,
    USERS_IN_ROOM,
    USERS_REF,
    SUBSCRIBED_ROOMS,
    USER_ROOMS
} from "./DbRefsConst";
import {loadUser} from './FriendsActions';
import notif from './../utils/Notifications';
import foregroundNotification from './../utils/ForegroundNotifications';
import store from './../store';
import {writeToActiveUsersInRoom, checkIsUserSubscribed} from './utils'

export const createRoom = (roomProps, roomPrivacy) => {
    if (roomPrivacy === 'private') {
        return createPrivateRoom(roomProps, roomPrivacy);
    } else {
        return createPublicRoom(roomProps, roomPrivacy);
    }
};

const createPublicRoom = ({title, roomType}, roomPrivacy) => {

    //todo created every time function is invoked, maybe initialize it somewhere else?
    const roomsRef = firebase.database().ref(PUBLIC_ROOMS_REF);
    const geoFireRooms = new GeoFire(firebase.database().ref(ROOM_TYPE[roomType].getPath()));
    const geoFireLocOfAllRooms = new GeoFire(firebase.database().ref(ALL_ROOMS_LOC_REF));

    return (dispatch, getState) => {
        const userCreatedRooms = firebase.database().ref(USER_ROOMS).child(getState().auth.user.uid);
        //todo catch error when can't get current location
        GpsService.getCurrentLocation().then(pos => {
            const {latitude, longitude} = pos.coords;
            const createdAt = firebase.database.ServerValue.TIMESTAMP;
            roomsRef.push({title, roomType, roomPrivacy, createdAt, location: {latitude, longitude}})
                .then(snap => {
                    geoFireRooms.set(snap.key, [latitude, longitude]);
                    geoFireLocOfAllRooms.set(snap.key, [latitude, longitude]);
                    userCreatedRooms.child(snap.key).set({createdAt})
                })

                .catch((err) => console.log(err))
        });

        dispatch({type: ACTIONS.CREATE_ROOM, title})
    }
};

const createPrivateRoom = ({currentUserId, senderId}, roomPrivacy) => {
    const privateRoomId = getPrivateRoomId(currentUserId, senderId);
    const roomsRef = firebase.database().ref(PRIVATE_ROOMS_REF).child(privateRoomId);

    const msgsRef = firebase.database().ref(MESSAGES_REF).child(privateRoomId);
    const msgs = msgsRef.limitToLast(20);
    const firstMsg = msgsRef.limitToFirst(1);

    return (dispatch, getState) => {
        roomsRef.once('value', (snapshot) => {
            if (!snapshot.val()) {
                roomsRef
                    .set({title: 'private_' + privateRoomId, roomPrivacy});
            }
        })
            .then(() => {
                dispatch({
                    type: ACTIONS.ADD_ROOM,
                    roomProps: {roomPrivacy},
                    roomId: privateRoomId,
                    isUserSubscribed: true
                });
                joinPrivateRoom(dispatch, currentUserId, privateRoomId, getState, msgs, firstMsg, roomPrivacy);
            })
            .catch(err => {
                console.log(err);
            });
    }
};

const generateNotifId = function () {
    let counter = 0;
    return () => {
        counter = counter + 1;
        return counter.toString();
    }
}();

export const joinRoom = (user, roomId, roomPrivacy) => {
    return (dispatch, getState) => {

        const msgsRef = firebase.database().ref(MESSAGES_REF).child(roomId);
        const msgs = msgsRef.limitToLast(20);
        const firstMsg = msgsRef.limitToFirst(1);

        if (roomPrivacy === 'private') {
            joinPrivateRoom(dispatch, user.uid, roomId, getState, msgs, firstMsg, roomPrivacy)
        } else {
            joinPublicRoom(dispatch, user, roomId, getState, msgs, firstMsg);
        }
    }
};

const joinPublicRoom = (dispatch, currentUser, roomId, getState, msgs, firstMsg) => {

    writeToActiveUsersInRoom(currentUser, roomId);

    if (!checkIsUserSubscribed(currentUser, roomId)) {
        subscribeToRoom(dispatch, roomId, currentUser.uid);
    }

    let initLoad = false;

    firstMsg.once('value')
        .then(snap => {
            const firstMsgKey = snap.val() !== null ? Object.keys(snap.val())[0] : null;
            return dispatch({type: ACTIONS.POPULATING_FIRST_MSG_KEY, firstMsgKey, roomId})

        }).then(msgs.once('value')
        .then(snap => {
            initLoad = true;
            const loadEarlier = shouldLoadEarlier(roomId, snap, getState);

            return dispatch({type: ACTIONS.INIT_FETCH_MSGS, snap, roomId, loadEarlier});
        })).catch(err => console.log(err));

    //generate notif id so notifications can be grouped
    const notifId = generateNotifId();
    const roomTitle = store.getState().rooms[roomId].title;
    msgs.on('child_added', snap => {
        if (!initLoad) return;
        const {roomEntered} = getState().social;
        onNewMessage(dispatch, getState, snap, {
            showNewMessageBackgroundNotification: notif.newPublicMsg,
            notifId
        }, {roomId, roomEntered, roomTitle})
    });
};

const joinPrivateRoom = (dispatch, currentUserId, roomId, getState, msgs, firstMsg, roomPrivacy) => {
    let initLoad = false;

    firstMsg.once('value')
        .then(snap => {
            const firstMsgKey = snap.val() !== null ? Object.keys(snap.val())[0] : null;
            return dispatch({type: ACTIONS.POPULATING_FIRST_MSG_KEY, firstMsgKey, roomId})

        }).then(msgs.once('value')
        .then(snap => {
            initLoad = true;
            const loadEarlier = shouldLoadEarlier(roomId, snap, getState);

            return dispatch({type: ACTIONS.INIT_FETCH_MSGS, snap, roomId, loadEarlier});
        })).catch(err => console.log(err));

    const notifId = generateNotifId();
    msgs.on('child_added', snap => {
        if (!initLoad) return;
        const {roomEntered} = getState().social;
        onNewMessage(dispatch, getState, snap,
            {showNewMessageBackgroundNotification: notif.newPrivateMsg, notifId},
            {roomId, roomEntered, roomPrivacy},
            currentUserId)
    });
};

function onNewMessage(dispatch, getState, snap, notificationProps, roomProps, currentUserId) {
    const {user, text} = snap.val();
    const {showNewMessageBackgroundNotification, notifId} = notificationProps;
    const {roomTitle, roomId, roomEntered, roomPrivacy} = roomProps;
    const {appState} = getState().appState;

    if (roomPrivacy === 'private' && currentUserId !== user._id && !getState().friendsDetails[user._id]) {
        loadUser(user._id)(dispatch);
    }

    if (appState === 'background') {
        showNewMessageBackgroundNotification(notifId, text, user, roomId, roomTitle)
    } else if (roomPrivacy === 'private' && appState === 'active' && !checkIfInRoom(roomId, roomEntered)) {
        foregroundNotification.newPrivateMessage(user, text, roomId);
    }

    dispatch({type: ACTIONS.FETCH_MSG, snap, roomId})
}

function checkIfInRoom(roomId, roomEntered) {
    if (!roomEntered[roomId] || !roomEntered[roomId].entered) {
        return false;
    }
    return true;
}

//todo this is called every time user loads room to which he'is subscribed
const subscribeToRoom = (dispatch, roomId, userUid) => {
    const subscribedRooms = firebase.database().ref(USERS_REF).child(userUid).child(SUBSCRIBED_ROOMS);
    subscribedRooms.update({[roomId]: true});
    dispatch({type: ACTIONS.SUBSCRIBE_ROOM, roomId, shouldSubscribe: true});
};

export const onLoadEarlierMsgs = (roomId) => {

    const msgRef = firebase.database().ref(`${MESSAGES_REF}/${roomId}`);

    return (dispatch, getState) => {
        dispatch({type: ACTIONS.STARTED_LOADING_EARLIER_MSGS, roomId});
        const endAt = Object.getOwnPropertyNames(getState().rooms[roomId].msgs)[0];

        msgRef.orderByKey().endAt(endAt).limitToLast(20).once('value')
            .then((snap) => {
                    const loadEarlier = shouldLoadEarlier(roomId, snap, getState);
                    dispatch({type: ACTIONS.LOAD_EARLIER_MSGS, snap, roomId, loadEarlier});
                }
            );
    }
};

export const pushMsg = (roomId, msg, roomPrivacy) => {
    const msgRef = firebase.database().ref(`${MESSAGES_REF}/${roomId}`);

    //todo this should be server time
    return (dispatch) => {
        const createdAt = firebase.database.ServerValue.TIMESTAMP;
        if (roomPrivacy === 'private') {
            msgRef.push({...msg, createdAt, read: false});
            return;
        }
        msgRef.push({...msg, createdAt});
    }
};

//todo need to redirect user if he's in room!
export const leaveRoom = (roomId) => {
    const userUuid = firebase.auth().currentUser.uid;

    const roomRef = firebase.database().ref(`${PUBLIC_ROOMS_REF}/${roomId}`);
    firebase.database().ref(`${MESSAGES_REF}/${roomId}`).off();
    roomRef.child(USERS_IN_ROOM).child(userUuid).remove();
    return (dispatch) => {
    }
};

export const unsubscribeFromRoom = (roomId) => {
    const userUuid = firebase.auth().currentUser.uid;
    const ref = `${USERS_REF}/${userUuid}${SUBSCRIBED_ROOMS}`;
    firebase.database().ref(ref).child(roomId).remove();

    return (dispatch) => {
        dispatch({type: ACTIONS.SUBSCRIBE_ROOM, roomId, shouldSubscribe: false});
        leaveRoom(roomId)(dispatch);
    };
};

export const removePrivateRoom = ({currentUserId, friendId}) => {
    const roomId = getPrivateRoomId(currentUserId, friendId);

    return (dispatch) => {
        firebase.database().ref(PRIVATE_ROOMS_REF).child(roomId).remove();
        firebase.database().ref(MESSAGES_REF).child(roomId).remove();
    }
};

export const enterPrivateRoom = (roomId) => {
    return {type: ACTIONS.ENTER_PRIVATE_ROOM, roomId, entered: true};
};

export const leavePrivateRoom = (roomId) => {
    return {type: ACTIONS.ENTER_PRIVATE_ROOM, roomId, entered: false};
};

const getPrivateRoomId = (currentUserId, senderId) => {
    const sortedIds = _.sortBy([currentUserId, senderId]);
    return sortedIds[0] + '_' + sortedIds[1];
};

const shouldLoadEarlier = (roomId, snap, getState) => {
    if (!snap.val()) return false;
    return Object.keys(snap.val())[0] !== getState().rooms[roomId].firstMsgKey;
};