import React, {Component, PropTypes} from "react";
import {Text, View, LayoutAnimation} from "react-native";
import {
    Container,
    Content,
    List,
    ListItem,
} from "native-base";
import {Actions} from 'react-native-router-flux';
import _ from "lodash";
import {NoFriendsView} from './../../components';
import FriendItemRow from "./FriendItem";
import I18n from "../../utils/Dictionary";

export default class FriendsView extends Component {

    static propTypes = {
        approveInvitationToFriends: PropTypes.func.isRequired,
        declineInvitationToFriends: PropTypes.func.isRequired,
        social: PropTypes.object.isRequired
    };

    componentWillUnmount() {
        LayoutAnimation.easeInEaseOut();
    }

    render() {

        const {social, user} = this.props;
        const {pendingInvitations, invitedUsers, friends, roomEntered} = social;

        if(this.isScreenEmpty(pendingInvitations, invitedUsers, friends)){
            return (<Container style={{backgroundColor: 'white'}}>
                <View style={{flex: 1}}>
                    <NoFriendsView/>
                </View>
            </Container>
            )
        }


        const sortedFriends = _.orderBy(friends, (friend) => {
            return friend.lastAction;
        }, 'desc');

        return (
            <Container style={{backgroundColor: '#ececec'}}>
                <Content style={{backgroundColor: '#fff'}}>
                    <List>
                        {this.renderPendingInvitations(pendingInvitations, user)}
                        {this.renderFriends(sortedFriends, roomEntered, user)}
                        {this.renderSentInvitations(invitedUsers)}
                    </List>
                </Content>
            </Container>
        )
    }

    renderPendingInvitations(pendingInvitations, currentUser) {
        if (pendingInvitations.length !== 0) {
            return (
                <View>
                    <ListItem itemDivider>
                        <Text>{I18n.t('pending_approvals')}</Text>
                    </ListItem>
                    {_.map(pendingInvitations, invitation => {
                        return (<FriendItemRow key={invitation.senderId}
                                               rowType={ROW_TYPE.PENDING_INVITATIONS}
                                               friendId={invitation.senderId}
                                               onApproveInvitation={this.approveInvitation.bind(this, currentUser.uid, invitation)}
                                               onDeclineInvitation={this.declineInvitation.bind(this, currentUser.uid, invitation)}/>);
                    })}
                </View>
            );
        }
        return null;
    };

    renderSentInvitations(invitedUsers) {
        if (invitedUsers.length !== 0) {
            return (
                <View>
                    <ListItem itemDivider>
                        <Text>{I18n.t('sent_invitations')}</Text>
                    </ListItem>
                    {_.map(invitedUsers, invitation => {
                        return (<FriendItemRow key={invitation.invitedUserId}
                                               rowType={ROW_TYPE.SENT_INVITATIONS}
                                               friendId={invitation.invitedUserId}
                        />);
                    })}
                </View>
            );
        }
        return null;
    };

    renderFriends(friends, roomEntered, currentUser) {
        if (friends.length !== 0) {
            return (
                <View>
                    <ListItem itemDivider>
                        <Text>{I18n.t('friends')}</Text>
                    </ListItem>
                    {_.map(friends, friend => {
                        if (friend.friendId) {
                            return (<FriendItemRow key={friend.friendId}
                                                   rowType={ROW_TYPE.ALREADY_FRIENDS}
                                                   friendId={friend.friendId}
                                                   roomEntered={roomEntered}
                                                   friend={friend}
                                                   onItemPress={this.onFriendItemPress.bind(this, currentUser, friend)}/>);
                        } else {
                            return null;
                        }
                    })}

                </View>
            );
        }
        return null;
    }

    isScreenEmpty(pendingInvitations, invitedUsers, friends){
        return _.isEmpty(pendingInvitations) &&  _.isEmpty(invitedUsers) && _.isEmpty(friends);
    }

    onFriendItemPress(currentUser, friend) {
        const roomId = this.getPrivateRoomId(currentUser.uid, friend.friendId);
        this.props.enterPrivateRoom(roomId);
        Actions.room({roomId, friendId: friend.friendId, roomPrivacy: 'private'});
    }

    approveInvitation(currentUserId, invitation) {
        const invitations = this.getInvitations(currentUserId, invitation);
        this.props.approveInvitationToFriends(invitations);
        const roomPrivacy = 'private';
        this.createRoom({currentUserId, senderId: invitation.senderId}, roomPrivacy);
    }

    declineInvitation(currentUserId, invitation) {
        const invitations = this.getInvitations(currentUserId, invitation);
        this.props.declineInvitationToFriends(invitations);
    }

    createRoom(roomProps, roomPrivacy) {
        this.props.createRoom(roomProps, roomPrivacy);
    }

    getInvitations(currentUserId, invitation) {
        const userInvitation = {
            userId: currentUserId,
            invitationId: invitation.invId
        };

        const senderInvitation = {
            senderId: invitation.senderId,
            invitationId: invitation.senderInvitationId
        };
        return {userInvitation, senderInvitation};
    }

    getPrivateRoomId(currentUserId, senderId) {
        const sortedIds = _.sortBy([currentUserId, senderId]);
        return sortedIds[0] + '_' + sortedIds[1];
    }
}

export const ROW_TYPE = {
    PENDING_INVITATIONS: 'pendingInvitations',
    SENT_INVITATIONS: 'sent_invitations',
    ALREADY_FRIENDS: 'alreadyFriends'
};