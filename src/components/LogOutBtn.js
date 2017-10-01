import React from 'react';
import {TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {Icon} from 'native-base';


const LogOutBtn = ({onPress}) =>
    <TouchableOpacity onPress={onPress}>
        <Icon ios='md-power' android='md-power' style={style.button}/>
    </TouchableOpacity>;


const style = {

    button: {
        color: (Platform.OS === 'ios') ? 'rgba(0,122,255,1.0)' : 'white',
        paddingRight: 8
    },

};


export default LogOutBtn;


