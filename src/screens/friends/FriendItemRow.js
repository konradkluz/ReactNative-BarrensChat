import React, {Component, PropTypes} from "react";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {Body, Left, ListItem, Right, Thumbnail} from "native-base";
import {Actions} from "react-native-router-flux";
import _ from "lodash";
import I18n from "../../utils/Dictionary";
import {ROW_TYPE} from './FriendsView';

export default class FriendItemRow extends Component {

    static propTypes = {
        loadUser: PropTypes.func.isRequired,
        friendsDetails: PropTypes.object.isRequired
    };

    render() {
        const {onApproveInvitation, onDeclineInvitation, onItemPress, friendsDetails, friend, friendId} = this.props;
        const {rowType} = this.props;
        const friendDetails = friendsDetails[friendId];

        if (friendDetails) {
            const onFriendItemPress = this.getOnFriendItemPressAction(onItemPress, friendDetails);
            return (
                <ListItem style={styles.itemStyle} button avatar onPress={onFriendItemPress}>
                    <Left>
                        {this.renderAvatar(friendDetails.photoURL, friendDetails.active)}
                    </Left>
                    <Body>
                    {this.renderFriendName(friend, friendDetails)}
                    {this.renderItemRowNote(friend, friendDetails, rowType)}
                    </Body>
                    <Right>
                        {this.renderButtons({onApproveInvitation, onDeclineInvitation}, {friendDetails}, rowType)}
                    </Right>
                </ListItem>
            )
        }
        return null;
    }

    componentDidMount() {
        const {friendId, friendsDetails} = this.props;
        const friendDetails = friendsDetails[friendId];

        if (friendId && !friendDetails) {
            this.props.loadUser(friendId);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {friend, roomEntered} = nextProps;
        this.markMessageAsRead(friend, roomEntered);
    }

    renderAvatar(photoURL, isActive) {
        if (photoURL) {
            return (
                <View>
                    {this.renderActive(isActive)}
                    <Thumbnail small source={{uri: photoURL}}/>
                </View>
            );
        } else {
            return (
                <View>
                    {this.renderActive(isActive)}
                    <Thumbnail small source={require('../../img/person-flat.png')}/>
                </View>
            );

        }
    }

    renderFriendName(friend, friendDetails) {
        if (this.friendHasLastMessage(friend)) {
            const {friendId, lastMessage} = friend;
            if (this.lastUnreadMessageIsFromFriend(friendId, lastMessage)) {
                return <Text style={{fontWeight: 'bold'}}>{friendDetails.displayName}</Text>
            }
        }
        return <Text style={styles.displayNameStyle}>{friendDetails.displayName}</Text>
    }

    renderItemRowNote(friend, friendDetails, rowType) {
        if (!friendDetails || !friend) {
            return this.renderNoteForInvitation(rowType);
        }
        return this.renderNoteForFriend(friend.lastMessage, friendDetails);
    }

    renderButtons(pendingInvitationProps, alreadyFriendProps, rowType) {
        if (rowType === ROW_TYPE.PENDING_INVITATIONS) {
            const {onApproveInvitation, onDeclineInvitation} = pendingInvitationProps;
            return this.renderPendingInvitationButtons(onApproveInvitation, onDeclineInvitation);
        } else if (rowType === ROW_TYPE.ALREADY_FRIENDS) {
            const {friendDetails} = alreadyFriendProps;
            return this.renderFriendProfileButton(friendDetails);
        } else {
            return null;
        }
    }

    renderFriendProfileButton(userToShow) {
        return (
            <TouchableOpacity onPress={this.onProfilePress.bind(null, userToShow)}>
                <Image style={styles.imageStyle}
                       source={require('../../img/user.png')}/>
            </TouchableOpacity>
        );
    }

    renderPendingInvitationButtons(onApproveInvitation, onDeclineInvitation) {
        if (onApproveInvitation && onDeclineInvitation) {
            return (
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={onApproveInvitation}>
                        <Image style={styles.imageStyle}
                               source={require('../../img/accept.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onDeclineInvitation}>
                        <Image style={styles.imageStyle} source={require('../../img/cancel.png')}/>
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    }

    renderActive(isActive) {
        if (isActive) {
            return <Image style={styles.activeStyle} source={require('../../img/dot-inside-a-circle.png')}/>
        }
        return null;
    }

    renderNoteForFriend(lastMessage, friend) {
        let author, note;
        if (lastMessage) {
            if (lastMessage.user._id === friend.uid) {
                author = friend.displayName;
            } else {
                author = I18n.t('you');
            }
            if (lastMessage.image) {
                note = author + ': ' + I18n.t('picture_sent');
            } else {
                let text = lastMessage.text;
                if (text.length > 40) {
                    text = _.padEnd(text, 37);
                }
                note = author + ': ' + text + '...';
            }
        } else {
            note = I18n.t('you_can_start_chat');
        }

        return (
            <Text style={styles.noteStyle} note>{note}</Text>
        );
    }

    renderNoteForInvitation(rowType) {
        let note;
        if (rowType === ROW_TYPE.PENDING_INVITATIONS) {
            note = I18n.t('approve_or_decline');
        } else if (rowType === ROW_TYPE.SENT_INVITATIONS) {
            note = I18n.t('invitation_not_approved_yet');
        }
        return (
            <Text style={styles.noteStyle} note>{note}</Text>
        );
    }

    getOnFriendItemPressAction(onItemPress, friendDetails) {
        let onFriendItemPress = this.onProfilePress.bind(null, friendDetails);
        if (onItemPress) {
            onFriendItemPress = onItemPress;
        }
        return onFriendItemPress;
    }

    onProfilePress(friendDetails) {
        Actions.userProfile({userToShow: friendDetails})
    }

    markMessageAsRead(friend, roomEntered) {
        if (this.friendHasLastMessage(friend)) {
            const {friendId, lastMessage, roomId} = friend;
            if (this.userIsInRoom(roomEntered, roomId)) {
                if (this.lastUnreadMessageIsFromFriend(friendId, lastMessage)) {
                    this.props.markMessageAsRead(roomId, lastMessage.messageId);
                }
            }
        }
    };

    friendHasLastMessage(friend) {
        return friend && friend.lastMessage;
    }

    userIsInRoom(rooms, roomId) {
        return rooms[roomId] && rooms[roomId].entered;
    }

    lastUnreadMessageIsFromFriend(friendId, lastMessage) {
        const {user, read} = lastMessage;
        return user._id === friendId && read === false;
    }
}

const styles = {
    itemStyle: {},
    displayNameStyle: {},
    activeStyle: {
        position: 'absolute',
        zIndex: 10
    },
    noteStyle: {
        fontSize: 11,
        color: '#797979'
    },
    imageStyle: {
        width: 30,
        height: 30,
        marginLeft: 10,
        marginRight: 5,
    }
};