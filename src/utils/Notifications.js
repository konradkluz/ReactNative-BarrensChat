// import PushNotifications from 'react-native-push-notification';
import {Platform} from 'react-native';
import {ENTER_PRIVATE_ROOM, SET_APP_STATE} from '../actions/ACTIONS';
import store from './../store';
import I18n from '../utils/Dictionary';
import {Actions} from 'react-native-router-flux';
import _ from 'lodash';
import * as firebase from 'firebase';
import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType
} from 'react-native-fcm';
import {USER_TOKENS_REF} from '../actions/DbRefsConst';


// PushNotifications.configure({
//     onNotification: function (notification) {
//         if(notification.userInteraction && notification.data) {
//             let room;
//             const {notifType, roomId, friendId} = notification.data;
//             switch (notifType) {
//                 case NOTIF_TYPES.newPublicMsg:
//                     room = store.getState().rooms[roomId];
//                     console.log(room);
//                     if (room) {
//                         Actions.pop();
//                         Actions.drawer();
//                         Actions.room({...room, roomId, roomPrivacy: 'public',});
//                     } else Actions.drawer();
//                     return;
//
//                 case NOTIF_TYPES.newPrivateMsg:
//                     room = store.getState().rooms[roomId];
//                     if (room) {
//                         store.dispatch({type: ENTER_PRIVATE_ROOM, roomId, entered: true});
//                         //todo test behaviour and add pop if there will be bugs
//                         Actions.pop();
//                         Actions.drawer();
//                         Actions.friends();
//                         Actions.room({...room, roomId, friendId, roomPrivacy: 'private'});
//                     } else Actions.drawer();
//                     return;
//                 case NOTIF_TYPES.newInvitationToFriends:
//                     Actions.pop();
//                     Actions.drawer();
//                     Actions.friends();
//                     return;
//                 case NOTIF_TYPES.newRoomInDistance:
//                     Actions.pop();
//                     Actions.drawer();
//                     return;
//
//                 default:
//                     return;
//             }
//         }
//     },
// });


export function initNotificationsService() {
    // FCM.getFCMToken().then(token => {
    //     console.log(token);
    //     storeToken(token);
    // });
    //
    // FCM.on(FCMEvent.Notification, (notif) => {
    //     if (notif.opened_from_tray) {
    //         console.log(notif);
    //     }
    // });
    //
    // FCM.on(FCMEvent.RefreshToken, (token) => {
    //     console.log(token);
    //     storeToken(token);
    // });
    //
    // FCM.presentLocalNotification({
    //     id: "UNIQ_ID_STRING",                               // (optional for instant notification)
    //     title: "My Notification Title",                     // as FCM payload
    //     body: "My Notification Message",                    // as FCM payload (required)
    //     sound: "default",                                   // as FCM payload
    //     priority: "high",                                   // as FCM payload
    //     click_action: "ACTION",                             // as FCM payload
    //     badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
    //     number: 10,                                         // Android only
    //     ticker: "My Notification Ticker",                   // Android only
    //     auto_cancel: true,                                  // Android only (default true)
    //     large_icon: "ic_launcher",                           // Android only
    //     icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
    //     big_text: "Show when notification is expanded",     // Android only
    //     sub_text: "This is a subText",                      // Android only
    //     color: "red",                                       // Android only
    //     vibrate: 300,                                       // Android only default: 300, no vibration if you pass null
    //     tag: 'some_tag',                                    // Android only
    //     group: "group",                                     // Android only
    //     picture: "https://google.png",                      // Android only bigPicture style
    //     my_custom_data:'my_custom_field_value',             // extra data you want to throw
    //     lights: true,                                       // Android only, LED blinking (default false)
    //     show_in_foreground: true                                  // notification when app is in foreground (local & remote)
    // });
}

function storeToken(token) {
    const userUid = firebase.auth().currentUser.uid;
    const tokenRef = firebase.database().ref(USER_TOKENS_REF).child(userUid);
    tokenRef.update({[token]: Platform.OS});
}

function exeNotif(notifType, notif) {
    const state = store.getState();
    if (_.includes(NOTIF_RIGHTS[notifType], state.appState.appState)) {
        const notifOptions = state.options.notifications;
        if (notifOptions['globalSetting'] && notifOptions[notifType]) {
            // notif()
        }
    }
}


export const NOTIF_TYPES = {
    newPublicMsg: 'newPublicMsg',
    newPrivateMsg: 'newPrivateMsg',
    newRoomInDistance: 'newRoomInDistance',
    newInvitationToFriends: 'newInvitationToFriends'
};

const APP_STATE = {
    BACKGROUND: 'background',
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};

const NOTIF_RIGHTS = {
    newPublicMsg: [APP_STATE.BACKGROUND],
    newPrivateMsg: [APP_STATE.BACKGROUND],
    newRoomInDistance: [APP_STATE.BACKGROUND],
    newInvitationToFriends: [APP_STATE.BACKGROUND]

};

const notif = {
    newPublicMsg: (id, text, user, roomId, roomTitle) => exeNotif(NOTIF_TYPES.newPublicMsg, () => {
            const data = {notifType: NOTIF_TYPES.newPublicMsg, roomId};
            // PushNotifications.localNotification({
            //     id: id,
            //     title: user.name,
            //     subText: roomTitle,
            //     ongoing: true,
            //     message: (Platform.OS === 'ios') ? `${user.name}: ${text}` : text,
            //     data: JSON.stringify(data),
            //     userInfo: data
            // })
        }
    ),
    newPrivateMsg: (id, text, author, roomId) => exeNotif(NOTIF_TYPES.newPrivateMsg, () => {
        const data = {notifType: NOTIF_TYPES.newPrivateMsg, roomId, friendId: author._id};
        // PushNotifications.localNotification({
        //     id: id,
        //     title: author.name,
        //     ongoing: true,
        //     message: (Platform.OS === 'ios') ? `${author.name}: ${text}` : text,
        //     data: JSON.stringify(data),
        //     userInfo: data
        // })
    }),
    newRoomInDistance: (title) => exeNotif(NOTIF_TYPES.newRoomInDistance, () => {
        const data = {notifType: NOTIF_TYPES.newRoomInDistance};
        // PushNotifications.localNotification({
        //     title: I18n.t('new_room_in_distance_notif'),
        //     message: (Platform.OS === 'ios') ? `${I18n.t('new_room_in_distance')}: ${title}` : title,
        //     data: JSON.stringify(data),
        //     userInfo: data
        // });
    }),
    subscribedRoomInDistance: (title) => exeNotif(NOTIF_TYPES.newRoomInDistance, () => {
        const data = {notifType: NOTIF_TYPES.newRoomInDistance};
        // PushNotifications.localNotification(({
        //     title: I18n.t('welcome_back_in_room_notif'),
        //     message: (Platform.OS === 'ios') ? `${I18n.t('welcome_back_in_room_notif')}: ${title}` : title,
        //     data: JSON.stringify(data),
        //     userInfo: data
        // }))
    }),
    newInvitationToFriends: () => exeNotif(NOTIF_TYPES.newInvitationToFriends, () => {
        const data = {notifType: NOTIF_TYPES.newInvitationToFriends};
        // PushNotifications.localNotification({
        //     title: I18n.t('new_friend_invitation'),
        //     message: `${I18n.t('new_friend_invitation')}`,
        //     data: JSON.stringify(data),
        //     userInfo: data
        // })
    }),
};


export default notif;