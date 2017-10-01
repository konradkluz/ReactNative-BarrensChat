import React, {Component, PropTypes} from "react";
import {Container, Content, ListItem, Thumbnail} from "native-base";
import {Alert, Image, Text, View} from "react-native";
import {Actions} from 'react-native-router-flux';
import _ from "lodash";
import {
    APPROVE_OR_DECLINE_INVITATION,
    INVITATION_NOT_APPROVED_YET,
    INVITE_USER_BUTTON,
    USER_ALREADY_FRIEND,
    REMOVE_FRIEND_BUTTON,
    OPEN_ROOM_BUTTON
} from "../../actions/social/SocialConst";
import {Header} from './../../components';
import I18n from "../../utils/Dictionary";

export default class UserProfileView extends Component {

    static propTypes = {
        approveInvitationToFriends: PropTypes.func.isRequired,
        declineInvitationToFriends: PropTypes.func.isRequired,
        inviteToFriends: PropTypes.func.isRequired,
        checkIfShowAddToFriendsButton: PropTypes.func.isRequired,
        createRoom: PropTypes.func.isRequired,
        social: PropTypes.object.isRequired,
    };

    render() {
        const {userToShow, currentUser, social} = this.props;
        const {socialProps} = social;
        return (
            <Container style={{backgroundColor: '#ececec'}}>
                <Header title={I18n.t('profile')} titleStyle={{width: 200, color: '#fff'}}/>

                <View style={[styles.card, styles.drawerHeaderContainer]}>
                    {this.renderAvatar(userToShow)}
                    <Text style={styles.displayName}>{userToShow.displayName}</Text>
                </View>
                <Content>
                    {this.renderProfileOptions(currentUser.uid, userToShow.uid, socialProps)}
                </Content>
            </Container>
        );
    }

    componentDidMount() {
        const {social, userToShow} = this.props;
        this.props.checkIfShowAddToFriendsButton(social, userToShow.uid);
    }

    renderAvatar(user) {
        if (user.photoURL) {
            return (
                <View>
                    {this.renderActiveLight(user.active)}
                    <Thumbnail large source={{uri: user.photoURL}}/>
                </View>
            )
        } else {
            return <Thumbnail large source={require('../../img/person-flat.png')}/>
        }
    }

    renderActiveLight(isActive){
        if(isActive){
            return <Image style={styles.activeLight} source={require('../../img/dot-inside-a-circle.png')}/>;
        }
        return null;
    }

    renderProfileOptions(currentUserId, userToShowId, socialProps) {
        return (
            <View>
                {this.renderInviteFriendRow(currentUserId, userToShowId, socialProps)}
                {this.renderOpenRoomRow(currentUserId, userToShowId, socialProps)}
                {this.renderRemoveFriendRow(currentUserId, userToShowId, socialProps)}
            </View>
        )
    }

    renderInviteFriendRow(currentUserId, userToShowId, socialProps) {
        if (currentUserId === userToShowId) {
            return null;
        }

        let {showInviteFriendButton, invitation} = socialProps;
        if (showInviteFriendButton === INVITE_USER_BUTTON) {
            return this.renderRow(
                true,
                this.inviteUserToFriends.bind(this, currentUserId, userToShowId),
                I18n.t('invite_user'),
                require('../../img/others.png'));
        } else if (showInviteFriendButton === USER_ALREADY_FRIEND) {
            return this.renderRow(
                false,
                null,
                I18n.t('user_already_friend'),
                require('../../img/accept.png'));
        } else if (showInviteFriendButton === APPROVE_OR_DECLINE_INVITATION) {
            return this.renderRow(
                true,
                this.showApproveInvitationPopup.bind(this, currentUserId, invitation),
                I18n.t('approve_or_decline'),
                require('../../img/checkmark-for-verification.png'));
        } else if (showInviteFriendButton === INVITATION_NOT_APPROVED_YET) {
            return this.renderRow(
                false,
                null,
                I18n.t('invitation_not_approved_yet'),
                require('../../img/time-left.png'));
        }
    }

    renderRow(isButton, onPress, text, imageSource) {
        return (
            <ListItem icon button={isButton} onPress={onPress}>
                <View style={styles.content}>
                    <Text>{text}</Text>
                    <Image style={styles.imageStyle} source={imageSource}/>
                </View>
            </ListItem>);
    }

    renderRemoveFriendRow(currentUserId, userToShowId, socialProps) {
        if (currentUserId === userToShowId) {
            return null;
        }

        const {showRemoveFriendButton, invitation} = socialProps;
        if (showRemoveFriendButton === REMOVE_FRIEND_BUTTON) {
            return this.renderRow(
                true,
                this.showRemoveFriendPopup.bind(this, invitation, {currentUserId, friendId: userToShowId}),
                I18n.t('remove_friend'),
                require('../../img/remove-user.png'));
        }
        return null;
    }

    renderOpenRoomRow(currentUserId, userToShowId, socialProps){
        if (currentUserId === userToShowId) {
            return null;
        }

        const {showOpenRoomButton} = socialProps;
        if (showOpenRoomButton === OPEN_ROOM_BUTTON) {
            return this.renderRow(
                true,
                this.openRoom.bind(this, currentUserId, userToShowId),
                I18n.t('write_message'),
                require('../../img/chat.png'));
        }
    }

    openRoom(currentUserId, friendId){
        const roomId = this.getPrivateRoomId(currentUserId, friendId);
        Actions.pop();
        this.props.enterPrivateRoom(roomId);
        Actions.room({roomId, friendId, roomPrivacy: 'private'});
    }

    removeFriend(invitation, usersIds) {
        this.props.removeFriend(invitation);
        this.props.removePrivateRoom(usersIds);
        Actions.pop();
    }

    inviteUserToFriends(senderId, receiverId) {
        const invitation = {senderId, receiverId};
        this.props.inviteToFriends(invitation)
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

    showApproveInvitationPopup(currentUserId, invitation) {
        Alert.alert(
            I18n.t('invitation'),
            I18n.t('approve_or_decline'),
            [
                {text: I18n.t('approve'), onPress: this.approveInvitation.bind(this, currentUserId, invitation)},
                {text: I18n.t('decline'), onPress: this.declineInvitation.bind(this, currentUserId, invitation)},
                {
                    text: I18n.t('cancel'), onPress: () => {
                }
                },
            ]
        )
    }

    showRemoveFriendPopup(invitation, usersIds) {
        Alert.alert(
            I18n.t('remove_friend'),
            I18n.t('are_you_sure_to_remove_friend'),
            [
                {text: I18n.t('approve'), onPress: this.removeFriend.bind(this, invitation, usersIds)},
                {
                    text: I18n.t('cancel'), onPress: () => {
                }
                },
            ]
        )
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

const styles = {
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    imageContainer: {
        flex: 1
    },
    nameTextContainer: {
        backgroundColor: '#fbfffb',
        padding: 15
    },
    nameText: {
        fontSize: 20
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 15
    },
    imageStyle: {
        width: 20,
        height: 20,
        marginLeft: 10,
        marginRight: 5,
    },


    displayName: {
        fontWeight: 'bold',
        marginTop: 5,
        color: '#e8e8e8'
    },
    drawerHeaderContainer: {
        paddingTop: 40,
        paddingBottom: 25,
        backgroundColor: '#1796fb',
        alignItems: 'center'
    },
    card: {
        zIndex: 100,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 5,
        shadowOpacity: 0.3,
    },
    activeLight:{
        width: 20,
        height: 20,
        position: 'absolute',
        zIndex: 10,
        alignSelf: 'flex-end'
    }
};