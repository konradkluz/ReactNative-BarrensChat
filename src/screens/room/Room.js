import {connect} from 'react-redux';
import {joinRoom, pushMsg, leaveRoom, leavePrivateRoom, pictureSent, onLoadEarlierMsgs, loadUser, inviteToFriends} from '../../actions';
import {bindActionCreators} from 'redux';
import RoomView from './RoomView';
import _ from 'lodash';


function mapStateToProps(state, ownProps) {

    let room = Object.assign({}, state.rooms[ownProps.roomId] || {});

    room.msgs = _(room.msgs || {}).map(val => {
        return {...val}
    }).reverse().value();

    if (ownProps.roomPrivacy === 'private') {
        const {friendsDetails} = state;
        if (friendsDetails && friendsDetails[ownProps.friendId]) {
            const {displayName} = friendsDetails[ownProps.friendId];
            room = Object.assign({}, room, {title: displayName});
        }
        room = Object.assign({}, room, {roomPrivacy: ownProps.roomPrivacy});
    }

    const {user} = state.auth;
    const {picture, social} = state;
    const socialCollections = getSocialCollections(social);

    return {room, user, picture, socialCollections}
}

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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        joinRoom,
        pushMsg,
        leaveRoom,
        leavePrivateRoom,
        pictureSent,
        onLoadEarlierMsgs,
        loadUser,
        inviteToFriends
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomView);