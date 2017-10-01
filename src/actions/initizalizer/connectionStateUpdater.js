import {NetInfo, Platform} from 'react-native';
import store from './../../store';
import * as ACTIONS from './../ACTIONS';
import * as firebase from 'firebase';
import {initialize} from './initializer';
import deinitialize from './deinitializer';
import * as DbRefs from '../DbRefsConst';

class ConnectionStateUpdater {

    firstLoadingOnIosDevice = true;

    _connectionChangeHandler = (isConnected) => {
        if (isConnected) {
            this._isConnectedHandler()
        }

        if (!isConnected) {
            this._isNotConnectedHandler()
        }
        store.dispatch({type: ACTIONS.SET_CONNECTION_STATE, isConnected});
    };

    _isConnectedHandler = () => {
        const prevConnection = store.getState().connection.isConnected;
        if (!prevConnection && prevConnection !== null) {
            firebase.database().goOnline();
            initialize(store.dispatch)();
        }
    };


    _isNotConnectedHandler = () => {
        deinitialize(store.dispatch, store.getState())
    };


    init = () => {
        if(Platform.OS === 'android'){
            NetInfo.isConnected.fetch().then(isConnected => {
                store.dispatch({type: ACTIONS.SET_CONNECTION_STATE, isConnected});
            })
        }

        if(Platform.OS === 'ios' && !this.firstLoadingOnIosDevice){
            NetInfo.isConnected.fetch().then(isConnected => {
                store.dispatch({type: ACTIONS.SET_CONNECTION_STATE, isConnected});
            })
        }

        NetInfo.isConnected.addEventListener('change', this._connectionChangeHandler)
        this._initIsActiveObserver();

        this.firstLoadingOnIosDevice = false;
    };


    deinit = () => {
        NetInfo.isConnected.removeEventListener('change', this._connectionChangeHandler);

        this._deinitIsActiveObserver();
    };


    _initIsActiveObserver() {
        const activeRef = firebase.database().ref(DbRefs.USERS_REF).child(firebase.auth().currentUser.uid).child('active');

        activeRef.on('value', activeSnap => {
            activeRef.onDisconnect().set(false).then(() => activeRef.set(true));
            store.dispatch({type: 'SETTING_USER_ACTIVE'});
        })

    }



    _deinitIsActiveObserver() {
        const activeRef = firebase.database().ref(DbRefs.USERS_REF).child(firebase.auth().currentUser.uid).child('active');
        activeRef.off();
    }


}


export default new ConnectionStateUpdater();