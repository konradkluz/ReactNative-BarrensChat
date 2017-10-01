import React from 'react';
import {Platform} from 'react-native';
import {Header as NativeHeader, Body, Title, Left, Right, View} from 'native-base';
import {BackButton} from './BackButton';
import {Error} from './error/ErrorView';


const Header = ({left = <BackButton/>, titleStyle = {}, title, right}) => {

    const shadowIfIos = Platform.OS === 'ios' ? styles.view : {};

    return (
        <View style={shadowIfIos}>

            <View style={{flexDirection: 'column'}}>
                <NativeHeader style={styles.card} hasSegment>
                    <Left>
                        {left}
                    </Left>
                    <Body>
                    <Title style={titleStyle}>{title}</Title>
                    </Body>
                    <Right>
                        {right}
                    </Right>
                </NativeHeader>
            </View>
            <Error/>
        </View>
    );
};

export  {Header};


const styles = {

    view: {
        zIndex: 10,
    },
    card: {
        backgroundColor: '#3a7094'
    }
};