import React from 'react';
import {StyleSheet, Text} from 'react-native';
import I18n from '../utils/Dictionary';
import {Icon} from 'native-base';
import * as Animatable from 'react-native-animatable';

const UserRemovedWhileInRoomView = () => {
    return (
        <Animatable.View style={styles.view} duration={2500} animation='bounceIn'>
            <Text style={styles.text}>{I18n.t('removed_from_friends')}</Text>
            <Icon active ios='ios-remove-circle-outline' android='md-remove-circle' style={baseStyle.icon}/>
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


export {UserRemovedWhileInRoomView};