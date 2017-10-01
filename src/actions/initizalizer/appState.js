import {AppState} from 'react-native';
import store from '../../store';
import {SET_APP_STATE} from '../ACTIONS';
import GpsService from '../../utils/geo';
import {initGeoOptymalizationQuery, deinitGeoOptimalizationQuery} from './geoOptimalization';
import * as firebase from 'firebase';



const APP_STATE = {
    BACKGROUND: 'background',
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};


export function initAppStateListener() {


    AppState.addEventListener('change', handleAppStateChange);
    initGeoOptymalizationQuery()

}

export function deinitAppStateListener() {
    AppState.removeEventListener('change', handleAppStateChange);
    deinitGeoOptimalizationQuery();
}


function handleAppStateChange(appState) {

    store.dispatch({type: SET_APP_STATE, appState});

    if (appState === APP_STATE.ACTIVE) {
        if(!store.getState().options.bgGeo) {
            GpsService.start();
            firebase.database().goOnline();
        }
        changeGpsConfigOnActive()

    }

    if (appState === APP_STATE.BACKGROUND) {
        if(!store.getState().options.bgGeo) {
            GpsService.stop();
            firebase.database().goOffline();
        }
        changeGpsConfigOnBackground()
    }
}


function changeGpsConfigOnBackground() {
    GpsService.setConfig({
        disableElasticity: true,
    }, function () {
        console.log('set background config success');
    }, function () {
        console.log('failed to setConfig');
    });

}

function changeGpsConfigOnActive() {
    GpsService.setConfig({
        disableElasticity: false,
    }, () => {
        console.log('set active config success');
    }, () => {
        console.log('failed to setConfig');
    })
}








