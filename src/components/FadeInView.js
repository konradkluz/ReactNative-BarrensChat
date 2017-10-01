import React from 'react';
import {LayoutAnimation} from 'react-native';

import { View } from 'react-native-animatable';


export default class FadeInView extends React.Component {



    componentWillUnmount() {

        LayoutAnimation.easeInEaseOut();

    }


    render() {
        return ( <View animation='bounceIn'>
            {this.props.children}
        </View> );
    }
}