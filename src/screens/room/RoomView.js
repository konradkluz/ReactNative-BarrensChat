import React, {Component, PropTypes} from 'react';
import {View, Text, Platform} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {Container, Spinner} from 'native-base';
import _ from 'lodash';
import {Header, OptionsButton, BackButton, OutOfRoomDistanceView, UserRemovedWhileInRoomView} from './../../components';
import uuid from 'uuid';
import CustomChat from '../../components/customChat/CustomChat';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';

export default class RoomView extends Component {

    static propTypes = {
        roomId: PropTypes.string.isRequired,
        joinRoom: PropTypes.func.isRequired,
        pushMsg: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
        messageIdGenerator: PropTypes.func,
        onLoadEarlierMsgs: PropTypes.func.isRequired,
    };

    componentWillMount() {
        if (Platform.OS === 'android') {
            AndroidKeyboardAdjust.setAdjustResize();
        }
    }

    render() {
        const {roomPrivacy, room, roomId, leavePrivateRoom} = this.props;

        const ActiveUserButton = () => this.renderOptionsButton(roomPrivacy, roomId);
        const PrivateBackButton = () => this.renderPrivateBackButton(roomPrivacy, roomId, leavePrivateRoom);

        return (
            <Container style={{backgroundColor: '#f6f6f6'}}>
                <Header title={room.title} titleStyle={{width: 200, color: '#fff'}}
                        left={<PrivateBackButton/>} right={<ActiveUserButton/>}/>
                {this.chatOrSpinnerIfMsgsAreLoading()}

            </Container>
        );
    };

    componentDidMount() {
        const {joinRoom, user, roomId, room, roomPrivacy} = this.props;
        const {isUserSubscribed} = room;
        if (!isUserSubscribed) {
            joinRoom(user, roomId, roomPrivacy);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.picture !== nextProps.picture) {
            this.sendMsgIfPictureSelected(nextProps, this.onSend);
        }
    }

    renderOptionsButton(roomPrivacy, roomId) {
        if (roomPrivacy === 'private') {
            return null;
        }
        return (
            <OptionsButton onPress={() => {
                Actions.activeUsers({roomId: roomId})
            }}/>);
    }

    renderPrivateBackButton(roomPrivacy, roomId, leavePrivateRoom) {
        if (roomPrivacy === 'private') {
            return (
                <BackButton onPress={() => {
                    leavePrivateRoom(roomId);
                    Actions.pop();
                }}/>);
        }
        return <BackButton/>;
    }

    onSend = (msg) => {
        const {roomPrivacy, roomId} = this.props;

        const extractedMsg = msg[0];
        if (msg.image) {
            this.props.pushMsg(roomId, msg, roomPrivacy);
        } else {
            this.props.pushMsg(roomId, extractedMsg, roomPrivacy);
        }
    };

    sendMsgIfPictureSelected(props, onSend) {
        const {picture, user, messageIdGenerator} = props;
        //url is present if picture was selected and saved in firebase storage
        if (picture.url) {

            const msg = {
                _id: messageIdGenerator(),
                image: picture.url,
                user: {_id: user.uid}
            };

            onSend(msg);
            props.pictureSent();
        }
    }

    showInitSpinner = () => {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Spinner color={'#3a7094'}/>
            </View>
        );
    };

    chatOrSpinnerIfMsgsAreLoading = () => {
        if (this.props.room.initFetchCompleted) {
            const chatProps = {
                user: this.props.user,
                friendProps: {
                    isFriend: this.isFriend.bind(this),
                    showUserProfile: this.showUserProfile,
                    inviteToFriends: this.inviteUserToFriends.bind(this)
                },
                room: this.props.room,
                onSend: this.onSend,
                onLoadEarlier: () => this.props.onLoadEarlierMsgs(this.props.roomId)
            };
            return (<CustomChat chatProps={chatProps}/>);
        } else if (!this.props.room.isUserSubscribed && this.props.room.roomPrivacy === 'private') {
            //TODO temporary there should be another conditions for checking if public and private rooms are removed
            return (
                <UserRemovedWhileInRoomView/>
            )
        } else if (!this.props.room.title) {
            return <OutOfRoomDistanceView/>
        }  else if (!this.props.room.initFetchCompleted) {
            return this.showInitSpinner();
        }

    };

    isFriend(userId) {
        const {socialCollections} = this.props;
        if (_.includes(socialCollections.friendIds, userId) ||
            _.includes(socialCollections.usersPendingInvitationsIds, userId) ||
            _.includes(socialCollections.invitedUsersIds, userId)) {
            return true;
        }
        return false;
    }

    showUserProfile(user) {
        Actions.userProfile({userToShow: user})
    }

    inviteUserToFriends(senderId, receiverId) {
        const invitation = {senderId, receiverId};
        this.props.inviteToFriends(invitation)
    }
}

RoomView.defaultProps = {
    messageIdGenerator: () => uuid.v4()
};




