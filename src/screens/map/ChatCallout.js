import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import MapView from 'react-native-maps';
import RoomItemMetaInfo from '../roomList/RoomItemMetaInfo';




const ChatCallout = (props) => {
    return (
        <MapView.Callout>
            <View style={style.callout}>
                <Text style={style.calloutTitle}>{props.room.title}</Text>
                <RoomItemMetaInfo room={props.room}/>
            </View>
        </MapView.Callout>

    )
};


const style = StyleSheet.create({
    callout: {
        flex: 1,
        // paddingRight: 10,
        // paddingBottom: 10,
        // marginRight: 10,
        // marginBottom: 10,
    },
    calloutTitle: {
        fontSize: 16
    }

});

export default ChatCallout;