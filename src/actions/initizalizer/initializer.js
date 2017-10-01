import * as ACTIONS from '../ACTIONS';
import _ from 'lodash';
import {Alert, Linking} from 'react-native';
import * as firebase from 'firebase';
import GeoFire from 'geofire';
import GpsService from '../../utils/geo';
import store from './../../store';
import initRoomInRadiusObserver from './roomInRadiusObserver';
import deinitialize from './deinitializer';
import {initDeviceLocationUpdater} from './deviceLocationUpdater';
import ROOM_TYPE from './ROOM_TYPE';
import ConnectionStateUpdater from './connectionStateUpdater';
import {initAppStateListener} from './appState';
import {initNotificationsService} from '../../utils/Notifications';


export function initializeRoomInRadiusMonitor(dispatch) {


    GpsService.start();

    GpsService.on('providerchange', handleProviderChange);

    initialize(dispatch)();

    ConnectionStateUpdater.init();

    initNotificationsService();
    performInitialUpdatesOfLocations();


}


export function initialize(dispatch) {
    return () => {
        initAppStateListener();
        dispatch({type: ACTIONS.SET_LAST_GEOINIT_TIMESTAMP, timestamp: Date.now()})
        dispatch({type: ACTIONS.LOADING_ROOMS_STARTED});
        GpsService.getCurrentLocation().then(pos => {
            initializeGlobalLocationSeter(dispatch);
            const initRoomObserver = roomObserverFactory(dispatch);
            //for each type defined in ROOM_TYPE initializes room observer
            _.forEach(ROOM_TYPE, roomType => initRoomObserver(roomType)(pos.coords.latitude, pos.coords.longitude));

        }).catch(err => {
            handleGpsError(err, initialize(dispatch))
            //todo rembember to remove this in prod
            Alert.alert(
                'Gps error',
                err.toString(),
                [
                    {
                        text: 'OK', onPress: () => callback()
                    }
                ]);
        });
    };
}


function performInitialUpdatesOfLocations() {
    let counter = 0;
    const interval = setInterval(() => {
        counter++;
        GpsService.getCurrentLocation(() => console.log('Success!'), (err) => console.log('error! ', err)), {
            desiredAccuracy: 20,
        };
        if (counter > 10) {
            clearInterval(interval);
        }
    }, 10000)
}

function roomObserverFactory(dispatch) {
    return (RoomType) => (lat, long) => {
        const geoQuery = createGeoQuery(dispatch, RoomType)(lat, long);
        initDeviceLocationUpdater(dispatch, geoQuery, RoomType.roomType);
        initRoomInRadiusObserver(dispatch, geoQuery);
    }

}


function createGeoQuery(dispatch, RoomType) {
    return (lat, long) => {
        const geoFireRooms = new GeoFire(firebase.database().ref(RoomType.getPath()));
        const geoQuery = geoFireRooms.query({
            center: [lat, long],
            radius: RoomType.radius
        });
        dispatch({type: ACTIONS.SET_GEOQUERY_ID, geoQuery, roomType: RoomType.roomType});
        return geoQuery;
    };
}


export function handleProviderChange(provider) {
    console.log('Provider change event initizalizer ', provider);
    if (provider.gps) {
        initialize(store.dispatch)();
    } else if (!provider.gps) {
        deinitialize(store.dispatch, store.getState());
    }
}


function initializeGlobalLocationSeter(dispatch) {
    const locationCallback = (pos) => {
        dispatch({type: ACTIONS.SET_POSITION, pos});
        console.log('position updated')
    };
    GpsService.on('location', locationCallback);
    dispatch({type: ACTIONS.SET_LOCATION_CALLBACK, roomType: 'global', locationCallback})
}


function handleGpsError(err, callback) {
    console.log(err);

    if (err === 1) {
        Alert.alert(
            'Couldn\'t fetch your location',
            'Please check if gps is turned on',
            [
                {
                    text: 'OK', onPress: () => callback()
                }
            ]);
    } else if (err.code === 1) {
        Alert.alert(
            'Couldn\'t fetch your location',
            'Please check if location setting of app is always',
            [
                {
                    text: 'OK Done!', onPress: () => callback()
                },
                {
                    text: 'Settings', onPress: () => {
                    Linking.openURL('app-settings:');
                    setTimeout(() => callback(), 1000)
                }
                }
            ]);

    } else {
        console.log(err);
        callback();
    }
}