import React from 'react';
import {TouchableOpacity, Platform} from 'react-native';
import {Icon} from 'native-base';

const OptionsButton = (props) =>
    <TouchableOpacity onPress={props.onPress}>
        <Icon ios='ios-more' android='md-more' style={style.button}/>
    </TouchableOpacity>;

const style = {

    button: {
        color: '#e8e8e8',
        paddingLeft: 8
    },

};

export {OptionsButton};