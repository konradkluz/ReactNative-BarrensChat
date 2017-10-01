import {Bubble, utils} from 'react-native-gifted-chat';
import React, {Component} from 'react';
import {
    Text,
    View,
    StyleSheet
} from 'react-native';
import I18n from '../../utils/Dictionary';

export default class CustomBubble extends Component {

    render() {

        return (
            <View>
                {this.props.position === 'left' ? this.renderMessage() : null}
                <Bubble {...this.props}
                        onLongPress={this.onLongPress}/>
            </View>
        );
    }

    renderMessage() {
        if (!utils.isSameUser(this.props.currentMessage, this.props.previousMessage)) {
            return <Text style={styles.nameAboveBubbleStyle}>{this.props.currentMessage.user.name}</Text>
        }
        else {
            return null;
        }
    }

    onLongPress(context) {

        const {currentMessage, friendProps} = this;
        const currentUser = this.user;
        const {isFriend, showUserProfile, inviteToFriends} = friendProps;
        const {text, user} = currentMessage;

        if (text) {

            let options = [
                I18n.t('profile'),
                I18n.t('cancel'),
            ];

            if (!isFriend(user._id) && currentUser._id !== user._id) {
                options = [
                    I18n.t('profile'),
                    I18n.t('invite_user'),
                    I18n.t('cancel'),
                ];
            }

            const cancelButtonIndex = options.length - 1;
            context.actionSheet().showActionSheetWithOptions({
                    options,
                    cancelButtonIndex,
                },
                (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                            showUserProfile({
                                uid: user._id,
                                displayName: user.name,
                                photoURL: user.avatar
                            });
                            break;
                        case 1:
                            if (cancelButtonIndex === 1) {
                                break;
                            }
                            inviteToFriends(currentUser._id, user._id);
                            break;
                    }
                });
        }
    }
}

const styles = StyleSheet.create({
    nameAboveBubbleStyle: {
        marginLeft: 10,
        color: '#a4a4a4',
        fontSize: 12
    }
});
