import React from 'react';
import {TouchableOpacity, StyleSheet, Platform, Text, View} from 'react-native';
import {Icon} from 'native-base';


const EnterRoomBtn = ({onPress}) =>
    <TouchableOpacity onPress={onPress}>
        <Icon name='arrow-forward' style={style.button}/>
    </TouchableOpacity>;


const style = {

    button: {
        color: (Platform.OS === 'ios') ? 'rgba(0,122,255,1.0)' : '#3F51B5',
        fontSize: 50,
        marginRight: 5
    },

};


export {EnterRoomBtn};


