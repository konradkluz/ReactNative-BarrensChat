import _ from 'lodash';
import {
    APPROVE_INVITATION,
    INVITE_FRIEND_BUTTON_SHOULD_BE_SHOWN,
    INVITE_TO_FRIENDS,
    LOAD_FRIENDS,
    LOAD_PENDING_INVITATIONS,
    LOAD_PENDING_INVITED_USERS,
    LOAD_PRIVATE_ROOM_LAST_MESSAGE,
    ENTER_PRIVATE_ROOM,
    REMOVE_FRIEND
} from "../actions/ACTIONS";
import {INVITE_USER_BUTTON} from "../actions/social/SocialConst";

const INITIAL_STATE = {
    friends: {},
    roomEntered: {},
    pendingInvitations: '',
    invitedUsers: '',
    socialProps: {
        showInviteFriendButton: INVITE_USER_BUTTON,
        showRemoveFriendButton: null,
        showOpenRoomButton: null,
        invitation: null
    },
    unreadMessages: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOAD_FRIENDS:
            const {friend} = action;
            return {
                ...state, friends: Object.assign({}, state.friends, {
                        [friend.friendId]: {
                            friendId: friend.friendId,
                            invitationId: friend.invitationId,
                            invitation: friend.invitation,
                            roomId: friend.roomId,
                            lastAction: friend.lastAction,
                            lastMessage: null
                        }
                    }
                )
            };
        case REMOVE_FRIEND:
            return {...state, friends: _.omit(state.friends, [action.friendId])};
        case LOAD_PENDING_INVITATIONS:
            return {...state, pendingInvitations: action.pendingInvitations};
        case LOAD_PENDING_INVITED_USERS:
            return {...state, invitedUsers: action.invitedUsers};
        case LOAD_PRIVATE_ROOM_LAST_MESSAGE:
            const {friendId, lastMessage} = action;
            const {messageId, text, image, createdAt, user, read} = lastMessage;

            let unreadMessage = null;
            if (friendId === user._id) {
                unreadMessage = {
                    [friendId]: read
                }
            }

            return {
                ...state, friends: Object.assign({}, state.friends,
                    {
                        [friendId]: Object.assign({},
                            state.friends[friendId],
                            {
                                lastMessage: {messageId, text, image, createdAt, user, read},
                                lastAction: createdAt
                            }
                        )
                    }
                ), unreadMessages: _.omitBy(
                    Object.assign({},
                        state.unreadMessages,
                        _.pick(unreadMessage, friendId)),
                    (alreadyRead) => {
                        return _.isEqual(alreadyRead, true);
                    })
            };
        case
        ENTER_PRIVATE_ROOM:
            const {roomId, entered} = action;
            return {...state, roomEntered: Object.assign(state.roomEntered, {[roomId]: {entered}})};
        case
        INVITE_FRIEND_BUTTON_SHOULD_BE_SHOWN:
        case
        INVITE_TO_FRIENDS:
        case
        APPROVE_INVITATION:
            return {...state, socialProps: action.socialProps};
        default:
            return state;
    }
}

