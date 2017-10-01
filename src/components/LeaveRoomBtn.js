import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import I18n from '../utils/Dictionary'


const LeaveRoomBtn = ({onPress}) =>
    <TouchableOpacity onPress={onPress}>
        <Text style={style.text}>{I18n.t("leave")}</Text>
    </TouchableOpacity>;


const style = {

    button: {
        height: 40,
        width: 30,
        marginRight: 10
    },

    text: {
        color: 'orangered',
        marginRight: 10,
        fontSize: 16
    }

};


export {LeaveRoomBtn};


