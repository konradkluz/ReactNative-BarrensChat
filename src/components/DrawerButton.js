import React from 'react';
import {Button, Icon} from 'native-base';


const DrawerButton = ({openDrawer}) => {
    return (
        <Button transparent onPress={openDrawer}>
            <Icon ios="ios-menu" android="md-menu" style={style.button}/>
        </Button>
    )
};

const style = {
    button: {
        color: '#f6f6f6',
        paddingLeft: 8
    },
};

export {DrawerButton};