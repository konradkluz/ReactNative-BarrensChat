import * as ACTIONS from './ACTIONS';
import * as firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import Fb from '../utils/Fb';
import Google from '../utils/Google';
import {initializeRoomInRadiusMonitor, handleProviderChange} from './initizalizer/initializer';
import deinitialize from './initizalizer/deinitializer';
import ConnectionStateUpdater from './initizalizer/connectionStateUpdater';
import {initializeSocial} from './social/SocialInitailization';
import {deinitializeSocial} from './social/SocialDeinitialization';
import GpsService from './../utils/geo';
import I18n from '../utils/Dictionary';
import {USERS_REF} from './DbRefsConst';
import {GOOGLE_PROVIDER, FACEBOOK_PROVIDER} from './AuthProviderConst';
import {loginFCMToken, logoutFCMToken} from './utils';
import {Crashlytics, Answers} from 'react-native-fabric';

export const loginUser = ({type}) => {
    return (dispatch) => {

        dispatch({type: ACTIONS.LOGIN_USER});

        switch (type) {
            case GOOGLE_PROVIDER:
                signInWithGoogle(dispatch);
                return;
            case FACEBOOK_PROVIDER:
                signInWithFb(dispatch);
                return;
            default:
                throw {name: 'Unknown login type enum'};
        }
    };
};

export const logout = () => {
    return (dispatch, getState) => {
        const user = firebase.auth().currentUser;
        const userRef = firebase.database().ref(USERS_REF).child(user.uid);

        logoutSocial(user);

        deinitialize(dispatch, getState());
        deinitializeSocial(dispatch, getState());

        GpsService.un('providerchange', handleProviderChange);

        ConnectionStateUpdater.deinit();

        logoutFCMToken();

        isUserActive(userRef, false);
        firebase.auth()
            .signOut();
        dispatch({type: ACTIONS.LOGOUT});
    }
};


function logoutSocial(user) {

    switch (user.providerData[0].providerId) {
        case GOOGLE_PROVIDER:
            Google.logout();
            return;
        case FACEBOOK_PROVIDER:
            Fb.logout();
            return;

        default:
            throw {name: 'Unknown provider id'}
    }
}


//Helpers


//todo need to deal with timeouts


function signInWithGoogle(dispatch) {
    Google.login()
        .then(accessToken => {
            const credential = firebase.auth.GoogleAuthProvider.credential(null, accessToken);
            return firebase.auth().signInWithCredential(credential)
        }).then(user => loginUserSuccess(dispatch, user))
        .catch((error) => {
            if (error.code === 7 || 12501) {
                dispatch({type: ACTIONS.LOGIN_USER_FAILED, payload: I18n.t('network_error')})
            } else {
                console.log(error);
                dispatch({type: ACTIONS.LOGIN_USER_FAILED, payload: I18n.t('failed_to_log_google')})
            }
            Crashlytics.logException(error.toString());
            Google.logout();

        })
}


function signInWithFb(dispatch) {
    Fb.login().then(accessToken => {
        const credential = firebase.auth.FacebookAuthProvider.credential(accessToken);
        return firebase.auth().signInWithCredential(credential)
    }).then(user => loginUserSuccess(dispatch, user))
        .catch((error) => {

            if (error.code === 'auth/network-request-failed' || error.message === 'net::ERR_TIMED_OUT') {
                dispatch({type: ACTIONS.LOGIN_USER_FAILED, payload: I18n.t('network_error')})
            } else {
                console.log(error);
                dispatch({type: ACTIONS.LOGIN_USER_FAILED, payload: I18n.t('failed_to_log_fb')})
            }
            Crashlytics.logException(error.toString());
            Fb.logout();

        })
}

const loginUserSuccess = (dispatch, user) => {
    loginFCMToken();
    setUserAuthProvider(dispatch, user);
    addUserDetailsIfNotExists(dispatch, user);
    initializeRoomInRadiusMonitor(dispatch);
    initializeSocial(dispatch, user.uid);
    Actions.main();
};

const setUserAuthProvider = (dispatch, user) => {
    const authProvider = user.providerData[0].providerId;
    dispatch({type: ACTIONS.SET_AUTH_PROVIDER, authProvider});
};

const addUserDetailsIfNotExists = (dispatch, userAuth) => {
    const userRef = firebase.database().ref(USERS_REF).child(userAuth.uid);
    let initLoad = true;
    userRef.on('value', (snapshot) => {
        let user = {...snapshot.val(), uid: snapshot.key};
        if (initLoad) {
            initLoad = false;
            if (!snapshot.val()) {
                let {uid, displayName, photoURL} = userAuth;
                userRef.set({displayName, photoURL});
                user = {uid, displayName, photoURL, active: true}
            }

            const {providerData} = userAuth;
            updateUserProfileWhenChanged(user, providerData[0], userAuth, userRef);

            dispatch({type: ACTIONS.LOGIN_USER_SUCCESS, payload: user});
        } else {
            dispatch({type: ACTIONS.UPDATE_USER, user})
        }
    })
};

function updateUserProfileWhenChanged(user, updateData, firebaseAuthUser, userRef) {
    if ((updateData.displayName && user.displayName !== updateData.displayName)
        || (updateData.photoURL && user.photoURL !== updateData.photoURL)) {
        return firebaseAuthUser.updateProfile({photoURL: updateData.photoURL})
            .then(function () {
                userRef.set({
                    displayName: updateData.displayName,
                    photoURL: updateData.photoURL
                });
            })
            .then(function () {
                user = Object.assign({}, user, {
                    displayName: updateData.displayName,
                    photoURL: updateData.photoURL
                });
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    return new Promise.resolve();
}


export const isUserActive = (userRef, active) => {
    userRef.update({active});
};

