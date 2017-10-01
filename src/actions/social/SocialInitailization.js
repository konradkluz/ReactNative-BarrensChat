import * as firebase from "firebase";
import _ from "lodash";
import {
    LOAD_FRIENDS,
    LOAD_PENDING_INVITATIONS,
    LOAD_PENDING_INVITED_USERS,
    LOAD_PRIVATE_ROOM_LAST_MESSAGE,
    ADD_ROOM,
    REMOVE_ROOM,
    ENTER_PRIVATE_ROOM,
    REMOVE_FRIEND
} from "../ACTIONS";
import notif from './../../utils/Notifications';
import store from './../../store';
import {joinRoom} from '../RoomActions';
import {APPROVED, REMOVED, PENDING} from "./SocialConst";
import {
    RECEIVED_INVITATIONS_REF, SENT_INVITATIONS_REF, MESSAGES_REF, PRIVATE_ROOMS_REF
} from '../DbRefsConst';

export const initializeSocial = (dispatch, currentUserId) => {
    loadPendingInvitations(dispatch, currentUserId);
    loadFriends(dispatch, currentUserId);
    listenForRemoved(dispatch, currentUserId);
    loadSentInvitations(dispatch, currentUserId);
};

const loadSentInvitations = (dispatch, currentUserId) => {
    const invitationsSentRef = firebase.database().ref(SENT_INVITATIONS_REF).child(currentUserId);
    invitationsSentRef
        .orderByChild('status')
        .startAt(PENDING)
        .endAt(PENDING)
        .on('value', snap => {
            dispatchLoadedInvitedUsers(dispatch, snap.val());
        })
};

const loadPendingInvitations = (dispatch, currentUserId) => {
    const receivedInvitationsRef = firebase.database().ref(RECEIVED_INVITATIONS_REF).child(currentUserId);

    receivedInvitationsRef
        .orderByChild('status')
        .startAt(PENDING)
        .endAt(PENDING)
        .on('value', snap => {
            dispatchLoadedPendingInvitations(dispatch, snap.val());
            if (snap.val()) {
                notif.newInvitationToFriends();
            }
        })
};

const listenForRemoved = (dispatch, currentUserId) => {
    const invitationsSentRef = firebase.database().ref(SENT_INVITATIONS_REF).child(currentUserId);
    const receivedInvitationsRef = firebase.database().ref(RECEIVED_INVITATIONS_REF).child(currentUserId);

    receivedInvitationsRef
        .orderByChild('status')
        .startAt(APPROVED)
        .endAt(APPROVED)
        .on('child_removed', snap => {
            const friendId = snap.val().senderId;
            const roomId = getPrivateRoomId(currentUserId, friendId);
            firebase.database().ref(MESSAGES_REF).child(roomId).off();
            dispatch({type: REMOVE_FRIEND, friendId});
            dispatch({type: ENTER_PRIVATE_ROOM, roomId, entered: false});
            dispatch({type: REMOVE_ROOM, key: roomId});
        });
    invitationsSentRef
        .orderByChild('status')
        .startAt(APPROVED)
        .endAt(APPROVED)
        .on('child_removed', snap => {
            const friendId = snap.val().receiverId;
            const roomId = getPrivateRoomId(currentUserId, friendId);
            firebase.database().ref(MESSAGES_REF).child(roomId).off();
            dispatch({type: REMOVE_FRIEND, friendId});
            dispatch({type: ENTER_PRIVATE_ROOM, roomId, entered: false});
            dispatch({type: REMOVE_ROOM, key: roomId});
        })
};

const loadFriends = (dispatch, currentUserId) => {
    const invitationsSentRef = firebase.database().ref(SENT_INVITATIONS_REF).child(currentUserId);
    const receivedInvitationsRef = firebase.database().ref(RECEIVED_INVITATIONS_REF).child(currentUserId);

    receivedInvitationsRef
        .orderByChild('status')
        .startAt(APPROVED)
        .endAt(APPROVED)
        .on('value', snap => {
            dispatchLoadedFriendsAction(dispatch, currentUserId, snap.val());
        });
    invitationsSentRef
        .orderByChild('status')
        .startAt(APPROVED)
        .endAt(APPROVED)
        .on('value', snap => {
            dispatchLoadedFriendsAction(dispatch, currentUserId, snap.val());
        })
};

const dispatchLoadedInvitedUsers = (dispatch, sentInvitations) => {
    const invitedUsers = _.map(sentInvitations, (val, invId) => {
        return {
            invitationId: invId,
            invitedUserId: val.receiverId
        }
    });
    dispatch({type: LOAD_PENDING_INVITED_USERS, invitedUsers});
};

const dispatchLoadedPendingInvitations = (dispatch, pendingInvitations) => {
    const receivedPending = _.map(pendingInvitations, (val, invId) => {
        return {...val, invId}
    });
    dispatch({type: LOAD_PENDING_INVITATIONS, pendingInvitations: receivedPending});
};

const dispatchLoadedFriendsAction = (dispatch, currentUserId, invitations) => {
    let friends = _.map(invitations, (invitation, invitationId) => {
        const friendId = invitation.senderId || invitation.receiverId;
        const senderId = invitation.senderId || currentUserId;
        const receiverId = invitation.receiverId || currentUserId;
        const senderInvitationId = invitation.senderInvitationId || invitationId;
        const receivedInvitationId = invitation.receivedInvitationId || invitationId;
        const roomId = getPrivateRoomId(currentUserId, friendId);
        const lastAction = invitation.lastAction;

        return {
            invitationId,
            invitation: {
                senderId,
                senderInvitationId,
                receiverId,
                receivedInvitationId
            },
            friendId,
            roomId,
            lastAction
        };
    });

    _.forEach(friends, friend => {
        dispatch({type: LOAD_FRIENDS, friend});
        loadLastMessagesAndPrivateRooms(dispatch, currentUserId, friend.roomId, friend.friendId);
    });
};

const loadLastMessagesAndPrivateRooms = (dispatch, currentUserId, roomId, friendId) => {
    const msgsRef = firebase.database().ref(MESSAGES_REF);
    const roomsRef = firebase.database().ref(PRIVATE_ROOMS_REF);

    loadLastMessage(dispatch, roomId, currentUserId, friendId, msgsRef);
    loadPrivateRoom(dispatch, roomId, currentUserId, friendId, roomsRef);
};

const loadLastMessage = (dispatch, roomId, currentUserId, friendId, msgsRef) => {
    msgsRef
        .child(roomId)
        .limitToLast(1)
        .on('value', snapshot => {
            if (snapshot.val()) {
                const {text, image, createdAt, user, read} = _.values(snapshot.val())[0];
                const messageId = _.keys(snapshot.val())[0];
                dispatch({
                    type: LOAD_PRIVATE_ROOM_LAST_MESSAGE,
                    friendId,
                    lastMessage: {
                        messageId,
                        text,
                        image,
                        createdAt,
                        user,
                        read
                    }
                });
            }
        });
};

const loadPrivateRoom = (dispatch, roomId, currentUserId, friend, roomsRef) => {
    roomsRef
        .child(roomId)
        .once('value', snap => {
            if (snap.val()) {
                const roomPrivacy = snap.val().roomPrivacy;
                const roomProps = {
                    roomPrivacy
                };

                dispatch({type: ADD_ROOM, roomProps, roomId: snap.key, isUserSubscribed: true});
                joinRoom({uid: currentUserId}, snap.key, roomPrivacy, friend.friendId)(store.dispatch, store.getState);
            }
        })
};

const getPrivateRoomId = (currentUserId, senderId) => {
    const sortedIds = _.sortBy([currentUserId, senderId]);
    return sortedIds[0] + '_' + sortedIds[1];
};