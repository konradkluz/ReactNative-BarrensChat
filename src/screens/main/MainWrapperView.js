import React, {Component} from 'react';
import {MessageBar, MessageBarManager} from 'react-native-message-bar';
import {Container} from 'native-base';
import {DefaultRenderer} from "react-native-router-flux";

export default class MainView extends Component {
    render() {
        const {navigationState} = this.props;
        const {children} = this.props.navigationState;
        return (
            <Container>
                <DefaultRenderer navigationState={children[navigationState.index]} onNavigate={this.props.onNavigate}/>
                <MessageBar ref="alert"/>
            </Container>
        )
    }

    componentDidMount() {
        MessageBarManager.registerMessageBar(this.refs.alert);
        console.log('MaIN COMPONENT MOUNTED')
    }

    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
        console.log('MaIN COMPONENT UNMOUNTED')
    }
}