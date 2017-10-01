import React, {Component} from 'react';
import {Platform, UIManager, BackAndroid, Alert} from 'react-native';
import {Provider} from 'react-redux';
import * as firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {StyleProvider} from 'native-base';
import Scenes from './Scenes';
import getTheme from './native-base-theme/components';
import platform from './native-base-theme/variables/platform';
import store from './store';
import * as ACTIONS from './actions/ACTIONS';
import Google from './utils/Google';
import I18n from './utils/Dictionary';


class App extends Component {

    componentWillMount() {

        Google.configue();

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental
            && UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        const config = {
            apiKey: "AIzaSyAUGCA1Up9LtSJw9ZbOo9IFcYj2NRrnvv4",
            authDomain: "rectus2-66ec5.firebaseapp.com",
            databaseURL: "https://rectus2-66ec5.firebaseio.com",
            projectId: "rectus2-66ec5",
            storageBucket: "rectus2-66ec5.appspot.com",
            messagingSenderId: "334625201053"
        };

        if (!store.getState().appState.firebaseInitialized) {
            firebase.initializeApp(config);
            store.dispatch({type: ACTIONS.FIREBASE_INITIALIZED, firebaseInitialized: true});
        }

        //if user is not logged in routes usser to login screen
        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                Actions.login();
            }


            BackAndroid.addEventListener('hardwareBackPress', function () {

                if (store.getState().scene.name === 'drawer') {
                    Alert.alert(
                        "",
                        I18n.t('exit'),
                        [
                            {text: I18n.t('yes'), onPress: () => BackAndroid.exitApp()},
                            {text: I18n.t('no'), onPress: () => {}}
                        ]
                    );
                    return () => true;
                } else {
                    Actions.pop();
                    return () => true;
                }


            });
        });


    }

    render() {
        return (
            <Provider store={store}>
                <StyleProvider style={getTheme(platform)}>
                    <Scenes/>
                </StyleProvider>
            </Provider>
        )
    }
}


export default App;