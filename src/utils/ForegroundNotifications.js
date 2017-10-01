import {MessageBarManager} from 'react-native-message-bar';
import {Actions} from 'react-native-router-flux';
import I18n from '../utils/Dictionary';
import store from './../store';
import {ENTER_PRIVATE_ROOM} from '../actions/ACTIONS';
import {markMessageAsRead} from '../actions/FriendsActions';

const foregroundNotification = {
    newPrivateMessage: (user, text, roomId) => {
        MessageBarManager.showAlert({
            avatar: user.avatar,
            title: I18n.t('user') + ': ' + user.name + ' ' + I18n.t('new_message'),
            message: text,
            alertType: 'info',
            stylesheetInfo: {
                backgroundColor: '#7d8d91',
                opacity: 0.5
            },
            titleStyle: {
                color: 'white',
                fontSize: 14,
                fontWeight: 'bold'
            },
            messageStyle: {
                color: 'white',
                fontSize: 12
            },
            messageNumberOfLines: 1,
            duration: 4000,
            durationToShow: 1000,
            durationToHide: 1000,
            onTapped: goToPrivateRoom.bind(null, user._id, roomId)
        });
    }
};

function goToPrivateRoom(friendId, roomId) {
    store.dispatch({type: ENTER_PRIVATE_ROOM, roomId, entered: true});
    markMessageAsRead(roomId, store.getState().social.friends[friendId].lastMessage.messageId)(store.dispatch);
    Actions.room({roomId, friendId, roomPrivacy: 'private'});
}

export default foregroundNotification;