import FCM, {FCMEvent} from 'react-native-fcm';
import store from '../../store';
import * as firebase from 'firebase';
import {Platform} from 'react-native';
import {USER_TOKENS_REF} from '../DbRefsConst';
import * as ACTIONS from '../ACTIONS';
import I18n from 'react-native-i18n';


let tokenListener;

export function loginFCMToken() {
    FCM.getFCMToken().then(token => {
        storeToken(token)
            .then(() => store.dispatch({type:ACTIONS.SET_FCM_TOKEN, FCMToken: token}))
    }).catch(err => console.log(err));

    tokenListener = FCM.on(FCMEvent.RefreshToken, token => {
        removeFCMToken().then(() => storeToken(token))
    })

}

export function logoutFCMToken() {
    tokenListener.remove();
    removeFCMToken();
}

export function updateNotifSettings(currFCMToken, notifType, isEnabled) {
    const userUid = firebase.auth().currentUser.uid;
    const tokenNotifRef = firebase.database().ref(USER_TOKENS_REF).child(userUid).child(currFCMToken).child("/notifications");
    return tokenNotifRef.update({[notifType]: isEnabled});

}


function storeToken(token) {
    const userUid = firebase.auth().currentUser.uid;
    const tokenRef = firebase.database().ref(USER_TOKENS_REF).child(userUid);
    return tokenRef.update({
        [token]: {
            os: `${Platform.OS}_${_.split(I18n.locale, '-')[0]}`,
            notifications: store.getState().options.notifications
        },
    });
}

function removeFCMToken() {
    const userUid = firebase.auth().currentUser.uid;
    const tokenRef = firebase.database().ref(USER_TOKENS_REF).child(userUid);
    return tokenRef.child(store.getState().FCMToken).remove();
}

