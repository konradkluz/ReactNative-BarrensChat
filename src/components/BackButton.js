import React from 'react';
import {TouchableOpacity, Platform} from 'react-native';
import {Icon} from 'native-base';
import {Actions} from 'react-native-router-flux';


const BackButton = ({onPress = () => Actions.pop()}) =>
    <TouchableOpacity onPress={onPress}>
        <Icon ios='ios-arrow-back' android='md-arrow-back' style={style.button}/>
    </TouchableOpacity>;


const style = {
    button: {
        color: '#e8e8e8',
        paddingLeft: 8
    },
};


export {BackButton};




