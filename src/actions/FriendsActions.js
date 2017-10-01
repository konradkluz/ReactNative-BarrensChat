import * as firebase from "firebase";
import _ from "lodash";
import {
    APPROVE_INVITATION,
    INVITE_FRIEND_BUTTON_SHOULD_BE_SHOWN,
    INVITE_TO_FRIENDS,
    USER_LOADED
} from "./ACTIONS";
import * as SocialConst from "./social/SocialConst";
import {RECEIVED_INVITATIONS_REF, SENT_INVITATIONS_REF, USERS_REF, MESSAGES_REF, INVITATIONS} from './DbRefsConst';

export const inviteToFriends = (invitation) => {

    const invitationsSentRef = firebase.database().ref(SENT_INVITATIONS_REF).child(invitation.senderId);
    const receivedInvitationsRef = firebase.database().ref(RECEIVED_INVITATIONS_REF).child(invitation.receiverId);

    return (dispatch, getState) => {
        const createdAt = firebase.database.ServerValue.TIMESTAMP;
        invitationsSentRef.push({
            receiverId: invitation.receiverId,
            status: SocialConst.PENDING,
            createdAt,
            lastAction: createdAt
        })
            .then(snap => {
                receivedInvitationsRef.push({
                    senderId: invitation.senderId,
                    senderInvitationId: snap.key,
                    status: SocialConst.PENDING,
                    createdAt,
                    lastAction: createdAt
                });
                dispatch({
                    type: INVITE_TO_FRIENDS, socialProps: {
                        showInviteFriendButton: SocialConst.INVITATION_NOT_APPROVED_YET,
                        invitation: null
                    }
                })
            }).then(() => {
            firebase.database().ref(INVITATIONS).push({
                    receiverId: invitation.receiverId,
                    senderDispalyName: getState().auth.user.displayName,
                    photoURL: getState().auth.user.photoURL
                });
        })
            .catch((err) => console.log(err));
    }
};

export const approveInvitationToFriends = (invitations) => {
    return updateInvitationWithStatus(invitations, SocialConst.APPROVED);
};

export const declineInvitationToFriends = (invitations) => {
    return updateInvitationWithStatus(invitations, SocialConst.DECLINED);
};

const updateInvitationWithStatus = (invitations, status) => {

    const {userInvitation, senderInvitation} = invitations;

    const receivedInvitationsRef = firebase.database()
        .ref(RECEIVED_INVITATIONS_REF)
        .child(userInvitation.userId)
        .child(userInvitation.invitationId);

    const invitationsSentRef = firebase.database()
        .ref(SENT_INVITATIONS_REF)
        .child(senderInvitation.senderId)
        .child(senderInvitation.invitationId);

    return (dispatch) => {
        const lastAction = firebase.database.ServerValue.TIMESTAMP;
        receivedInvitationsRef.update({status, lastAction})
            .then(() => {
                invitationsSentRef.update({status, lastAction, receivedInvitationId: userInvitation.invitationId});
                dispatch({
                    type: APPROVE_INVITATION, socialProps: {
                        showInviteFriendButton: SocialConst.USER_ALREADY_FRIEND,
                        showRemoveFriendButton: SocialConst.REMOVE_FRIEND_BUTTON,
                        showOpenRoomButton: SocialConst.OPEN_ROOM_BUTTON,
                        invitation: null
                    }
                });
            })
            .catch(err => {
                console.log(err);
            });
    }
};

export const removeFriend = (invitation) => {
    const {senderId,
        senderInvitationId,
        receiverId,
        receivedInvitationId} = invitation;

    const receivedInvitationsRef = firebase.database()
        .ref(RECEIVED_INVITATIONS_REF)
        .child(receiverId)
        .child(receivedInvitationId);

    const invitationsSentRef = firebase.database()
        .ref(SENT_INVITATIONS_REF)
        .child(senderId)
        .child(senderInvitationId);

    return (dispatch) => {
        receivedInvitationsRef.remove()
            .then(() => {
                invitationsSentRef.remove();
            })
            .catch(err => {
                console.log(err);
            });
    }
};

export const checkIfShowAddToFriendsButton = (social, userId) => {
    const socialCollections = getSocialCollections(social);
    const socialProps = checkIfIncludedInAnyCollection(socialCollections, userId, social);

    return (dispatch) => {
        dispatch({type: INVITE_FRIEND_BUTTON_SHOULD_BE_SHOWN, socialProps});
    }
};

//checks if given userId is included in any of social collections. if yes it returns proper state of social.
//if not it returns default
const checkIfIncludedInAnyCollection = (socialCollections, userId, social) => {
    let socialProps = {
        showInviteFriendButton: SocialConst.INVITE_USER_BUTTON,
        showRemoveFriendButton: null,
        showOpenRoomButton: null,
        invitation: null
    };
    if (_.includes(socialCollections.friendIds, userId)) {

        const invitation = social.friends[userId].invitation;

        socialProps = Object.assign(socialProps, {
            showInviteFriendButton: SocialConst.USER_ALREADY_FRIEND,
            showRemoveFriendButton: SocialConst.REMOVE_FRIEND_BUTTON,
            showOpenRoomButton: SocialConst.OPEN_ROOM_BUTTON,
            invitation
        });
    } else if (_.includes(socialCollections.usersPendingInvitationsIds, userId)) {
        const invitation = _.find(social.pendingInvitations, (i) => {
            return i.senderId === userId
        });
        socialProps = Object.assign({}, {
            showInviteFriendButton: SocialConst.APPROVE_OR_DECLINE_INVITATION,
            invitation: invitation
        });
    } else if (_.includes(socialCollections.invitedUsersIds, userId)) {
        socialProps = Object.assign(socialProps, {showInviteFriendButton: SocialConst.INVITATION_NOT_APPROVED_YET});
    }
    return socialProps;
};

//returns object with arrays of possible user state eg. friends, users from which are pending invitations and
//users to whom the invitation was sent
const getSocialCollections = (social) => {
    const friendIds = _.map(social.friends, friend => {
        return friend.friendId;
    });

    const usersPendingInvitationsIds = _.map(social.pendingInvitations, invitation => {
        return invitation.senderId;
    });

    const invitedUsersIds = _.map(social.invitedUsers, user => {
        return user.invitedUserId;
    });

    return {friendIds, usersPendingInvitationsIds, invitedUsersIds};
};

export const loadUser = (userId) => {
    const usersRef = firebase.database().ref(USERS_REF).child(userId);
    return (dispatch) => {
        usersRef
            .on('value', (snapshot) => {
                const userData = {
                    uid: userId,
                    displayName: snapshot.val().displayName,
                    photoURL: snapshot.val().photoURL,
                    active: snapshot.val().active
                };
                dispatch({type: USER_LOADED, userData});
            });
    }
};

export const markMessageAsRead = (roomId, messageId) => {
    const msgsRef = firebase.database().ref(MESSAGES_REF).child(roomId).child(messageId);
    return (dispatch) => {
        msgsRef.update({read: true})
            .catch(err => {
                console.log(err);
            });
    }
};