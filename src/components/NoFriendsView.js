import React from 'react';
import {StyleSheet, Text} from 'react-native';
import I18n from '../utils/Dictionary';
import {Icon} from 'native-base';
import * as Animatable from 'react-native-animatable';



const NoFriendsView = () => {
    return (
        <Animatable.View style={styles.view} duration={2500} animation='bounceIn'>
            <Text style={styles.text}>{I18n.t('no_friends')}</Text>
            <Icon active name='people' style={baseStyle.icon}/>
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


export {NoFriendsView};