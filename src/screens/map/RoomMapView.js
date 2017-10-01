import React, {Component} from 'react';
import {View, LayoutAnimation, Platform, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {Icon, Container, Spinner} from 'native-base';
import MapView from 'react-native-maps';
import {Actions} from 'react-native-router-flux';
import _ from 'lodash';
import ROOM_TYPE from '../../actions/initizalizer/ROOM_TYPE';
import ChatCallout from './ChatCallout';
import ActionButton from 'react-native-action-button';
import CreateRoom from '../createRoomOnMap/CreateRoom';
import CreateRoomMapCircle from '../createRoomOnMap/CreateRoomMapCircle';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import * as ACTIONS from '../../actions/ACTIONS';

export default class RoomMapView extends Component {

    render() {
        const {position, region, roomMap, style} = this.props;

        return (
            <Container style={{backgroundColor: '#ececec'}}>
                {this.renderSpinnerOrMap(position, region, roomMap, style)}
            </Container>

        );

    }
    componentWillMount() {
        if (Platform.OS === 'android') {
            AndroidKeyboardAdjust.setAdjustPan();
        }
        this.props.initRoomMapQuery();


        LayoutAnimation.easeInEaseOut();
    }

    componentWillUnmount() {
        this.props.dispatch({type: ACTIONS.TOOGLE_ROOM_CREATION, collapsed: true});
        this.props.deinitRoomMapQuery();
    }

    renderSpinnerOrMap = (position, region, roomMap, style) => {
        if (!position.coords) {
            return (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner color={'#3a7094'}/>
                </View>
            );
        }

        return (
            <View style={{flex: 1}}>
                <CreateRoom/>

                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={style || styles.container}>
                        <MapView
                            style={styles.map}
                            userLocationAnnotationTitle=""
                            showsCompass
                            showsScale
                            loadingEnabled
                            showsBuildings
                            showsUserLocation
                            region={region}
                            onRegionChangeComplete={this.onRegionChange}
                            >
                            {!this.props.mapViewState.createRoomCollapsed && <CreateRoomMapCircle/>}
                            {this.props.mapViewState.createRoomCollapsed && this.renderRoomCircles(roomMap)}
                            {this.props.mapViewState.createRoomCollapsed && this.renderRoomMarkers(roomMap)}
                        </MapView>
                        <ActionButton buttonColor="rgba(231,76,60,1)">
                            <ActionButton.Item buttonColor='#3498db' title="Create chat" onPress={this.toggleExpanded}>
                                <Icon name="chatbubbles" style={styles.actionButtonIcon}/>
                            </ActionButton.Item>
                        </ActionButton>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    };

    renderRoomCircles = (roomMap) => {
        return _(roomMap).map(room => {
            const {latitude, longitude} = room.location;
            return <MapView.Circle
                key={`${(ROOM_TYPE[room.roomType].radius * longitude * latitude).toString()}${room.title}`}
                center={{latitude, longitude}}
                radius={ROOM_TYPE[room.roomType].radius * 1000}
                fillColor={room.inDistance ? "rgba(68, 251, 12, 0.2)" : "rgba(6, 11, 251, 0.5)"}
                strokeColor="rgba(0, 0, 0, 0.2)">
            </MapView.Circle>
        }).value();
    };

    renderRoomMarkers = (roomMap) => {
        return _(roomMap).map(room => {
            const {latitude, longitude} = room.location;
            return <MapView.Marker
                key={room.title}
                onCalloutPress={this.onCalloutPress.bind(this, room)}
                coordinate={{latitude, longitude}}
                image={require('./../../img/chatMarker.png')}
                centerOffset={{x: 15, y: -15}}>
                <ChatCallout room={room}/>
            </MapView.Marker>
        }).value()
    };

    toggleExpanded = () => {
        this.props.dispatch({type: ACTIONS.TOOGLE_ROOM_CREATION, collapsed: false});
    };

    onRegionChange = (region) => {
        this.props.dispatch({type: ACTIONS.SET_REGION, region});
    };

    onCalloutPress = (room) => {
        if(room.inDistance){
            Actions.room({...room, roomPrivacy: 'public'});
        }
    };
}

const styles = {
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    container: {
        backgroundColor: '#ececec',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
};