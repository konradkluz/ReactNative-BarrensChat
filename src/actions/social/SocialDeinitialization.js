import * as firebase from 'firebase';
import {
    RECEIVED_INVITATIONS_REF, SENT_INVITATIONS_REF, USERS_REF
} from '../DbRefsConst';
import {UNLOAD_USER} from "../ACTIONS";

export function deinitializeSocial(dispatch, state) {
    stopListeningForInvitations(state.auth);
    stopListeningForLoadedUsersDetails(dispatch, state.social);
}

function stopListeningForInvitations({user}) {
    firebase.database().ref(SENT_INVITATIONS_REF).child(user.uid).off();
    firebase.database().ref(RECEIVED_INVITATIONS_REF).child(user.uid).off();
}

function stopListeningForLoadedUsersDetails(dispatch, {friends, invitedUsers, pendingInvitations}) {
    invitedUsers.forEach(invitation => {
        stopListeningForUser(dispatch, invitation.invitedUserId);
    });
    pendingInvitations.forEach(invitation => {
        stopListeningForUser(dispatch, invitation.senderId);
    });
    Object.keys(friends).forEach(friendId => {
        stopListeningForUser(dispatch, friendId);
    });
}

function stopListeningForUser(dispatch, userId){
    firebase.database().ref(USERS_REF).child(userId).off();
    dispatch({type: UNLOAD_USER, userId});
}