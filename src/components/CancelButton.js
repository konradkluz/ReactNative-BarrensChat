import React from 'react';
import {Button, Text} from 'native-base';
import I18n from '../utils/Dictionary';



const CancelButton = (props) => {
    return (
        <Button onPress={props.onPress} transparent>
            <Text>{I18n.t('cancel')}</Text>
        </Button>
    );
};


export {CancelButton}