import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import I18n from '../utils/Dictionary';
import {Icon} from 'native-base';
import * as Animatable from 'react-native-animatable';


const {height} = Dimensions.get('window');

const OutOfRoomDistanceView = () => {
    return (
        <Animatable.View style={styles.view} duration={2500} animation='bounceIn'>
            <View style={{flex:1, height: 200}}>
            <Text style={styles.text}>{I18n.t('left_room_distance_while_in_room')}</Text>
            <Icon active name='map' style={baseStyle.icon}/>
            </View>
        </Animatable.View>

    )
};


const baseStyle = {
    icon: {
        color: 'darkgrey',
        fontSize: 70,
        alignSelf: 'center'
    }
};


const styles = StyleSheet.create({
    view: {
        paddingTop: 20,
        flex: 1,
        alignItems: 'center'
    },
    text: {
        fontSize: 25,
        color: 'darkgrey',
        textAlign: 'center',
    }

});


export {OutOfRoomDistanceView};