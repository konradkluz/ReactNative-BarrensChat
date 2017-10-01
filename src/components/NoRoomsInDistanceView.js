import React from 'react';
import {StyleSheet, Text} from 'react-native';
import I18n from '../utils/Dictionary';
import {Icon} from 'native-base';
import * as Animatable from 'react-native-animatable';



const NoRoomsInDistanceView = () => {
    return (
        <Animatable.View style={styles.view} duration={2500} animation='bounceIn'>
            <Text style={styles.text}>{I18n.t('no_rooms_in_distance')}</Text>
            <Icon active name='text' style={baseStyle.icon}/>
        </Animatable.View>

    )
};


const baseStyle = {
    icon: {
        color: 'darkgrey',
        fontSize: 70
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
        color: 'darkgrey'
    }

});


export {NoRoomsInDistanceView};