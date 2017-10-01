import React, {Component} from 'react';
import {View} from 'react-native';
import I18n from '../../utils/Dictionary';
import {ListItem, Text, Icon, Body, Left, Right, Switch} from 'native-base'
import {NOTIF_TYPES} from './../../utils/Notifications';


export default class NotificationSettings extends Component {
    constructor(props) {
        super(props);


    }


    resolveNotifSetting = (globalSetting, notifSetting) => {
        if (!globalSetting) return false;
        else
            return notifSetting;
    };

    render() {

        const {globalSetting, setNotifications, notifications} = this.props;

        return (
            <View style={styles.container}>
                <ListItem itemDivider style={styles.itemDivider}>
                    <Text style={styles.textDivider}>{I18n.t('all_notifications_settings')}</Text>
                </ListItem>
                <ListItem button onPress={() => {
                    setNotifications('globalSetting', !globalSetting)
                }}>
                    <Body style={{flex: 1}}>
                    <Text style={styles.mainText}>{I18n.t('notifications')}</Text>
                    </Body>

                    <Right>
                        <Switch value={globalSetting}
                                onValueChange={(value) => setNotifications('globalSetting', value)}/>
                    </Right>

                </ListItem>

                <ListItem itemDivider style={styles.itemDivider}>
                    <Text style={styles.textDivider}>{I18n.t('particular_notification_type')}</Text>
                </ListItem>

                <ListItem button
                          onPress={() => setNotifications(NOTIF_TYPES.newPublicMsg, !notifications[NOTIF_TYPES.newPublicMsg])}>

                    <Left>
                        <Text style={styles.text}>{I18n.t('public_room_message')}</Text>
                    </Left>

                    <Right>
                        <Switch
                            ref="publicMsgRef"
                            value={this.resolveNotifSetting(globalSetting, notifications[NOTIF_TYPES.newPublicMsg])}
                            onValueChange={(value) => setNotifications(NOTIF_TYPES.newPublicMsg, value)}
                            disabled={!globalSetting}/>
                    </Right>

                </ListItem>
                <ListItem button
                          onPress={() => setNotifications(NOTIF_TYPES.newPrivateMsg, !notifications[NOTIF_TYPES.newPrivateMsg])}>

                    <Left>
                        <Text style={styles.text}>{I18n.t('private_message')}</Text>
                    </Left>

                    <Right>
                        <Switch
                            value={this.resolveNotifSetting(globalSetting, notifications[NOTIF_TYPES.newPrivateMsg])}
                            onValueChange={(value) => setNotifications(NOTIF_TYPES.newPrivateMsg, value)}
                            disabled={!globalSetting}/>
                    </Right>

                </ListItem>
                <ListItem button
                          onPress={() => setNotifications(NOTIF_TYPES.newRoomInDistance, !notifications[NOTIF_TYPES.newRoomInDistance])}>

                    <Left>
                        <Text style={styles.text}>{I18n.t('new_chat_in_distance')}</Text>
                    </Left>

                    <Right>
                        <Switch
                            value={this.resolveNotifSetting(globalSetting, notifications[NOTIF_TYPES.newRoomInDistance])}
                            onValueChange={(value) => setNotifications(NOTIF_TYPES.newRoomInDistance, value)}
                            disabled={!globalSetting}/>
                    </Right>

                </ListItem>
            </View>
        )
    }
}


const styles = {
    itemDivider: {
        borderColor: '#cacaca'
    },
    textDivider: {
        opacity: 0.7
    },

    mainText: {
        color: '#4f585c',
        fontWeight: 'bold'
    },
    text: {
        opacity: 0.84
    }
};



