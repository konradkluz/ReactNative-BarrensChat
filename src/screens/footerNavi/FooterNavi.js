import React, {Component} from 'react';
import {DefaultRenderer} from "react-native-router-flux";
import FooterNaviConnected from './FooterNaviConnected';


export default class FooterNavi extends Component {
    render() {
        const {children} = this.props.navigationState;
        return (
                <FooterNaviConnected>
                    <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
                </FooterNaviConnected>
        )
    }
}