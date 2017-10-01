import {combineReducers} from 'redux';
import auth from './AuthReducer';
import rooms from './RoomsReducer';
import loading from './LoadingReducer';
import scene from './RoutesReducer';
import * as ACTIONS from '../actions/ACTIONS';
import {reducer as form} from 'redux-form';
import handles from './HandlesReducer';
import picture from './CameraActionsReducer';
import drawer from './DrawerOptionsReducer';
import social from './FriendsReducer';
import friendsDetails from './FriendItemReducer';
import options from './OptionsReducer';
import position from './PositionReducer';
import roomMap from './RoomMapReducer';
import mapViewState from './MapViewReducer';
import appState from './AppStateReducer';
import connection from './ConnectionReducer';
import lastGeoinitTime from './LastGeoInitTimestampReducer';
import region from './RegionReducer';
import geoOptymalization from './GeoOptymalizationReducer';
import FCMToken from './FCMTokenReducer';


const appReducer = combineReducers({
    auth,
    rooms,
    form,
    loading,
    scene,
    handles,
    picture,
    drawer,
    social,
    friendsDetails,
    options,
    position,
    roomMap,
    mapViewState,
    appState,
    mapViewState,
    connection,
    lastGeoinitTime,
    region,
    geoOptymalization,
    FCMToken
});


const rootReducer = (state, action) => {

    if (action.type === ACTIONS.LOGOUT) {
        state = undefined
    }

    return appReducer(state, action);
};


export default rootReducer;