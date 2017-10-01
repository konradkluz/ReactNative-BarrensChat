import React, {Component} from 'react';
import {View, Platform} from 'react-native';
import {
    Footer,
    FooterTab,
    Button,
    Icon,
    Text,
    View as NativeView,
    Container,
    StyleProvider,
    getTheme
} from 'native-base';
import * as ACTIONS from '../../actions/ACTIONS';
import {Actions} from 'react-native-router-flux';
import I18n from '../../utils/Dictionary';
import {Header, DrawerButton, CancelButton, Error} from './../../components';


//active route
class FooterNavi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastScene: ''
        }
    }

    resolveTitleForScene = (sceneName) => {
        switch (sceneName) {
            case 'roomList':
                return I18n.t('chats_in_location');
            case 'roomMap':
                return I18n.t('map_title');
            case 'friends':
                return I18n.t('friends');
            default:
                return 'Loading'
        }
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.scene.children === undefined && this.props.scene.name === 'drawer') {
            this.setState({
                lastScene: this.props.scene.children[0].children[0].name
            })
        }
    }

    cancelRoomCreation = () => {
        this.props.dispatch({type: ACTIONS.TOOGLE_ROOM_CREATION, collapsed: true});
    };

    resolveIfCancelButtonShouldBeDisplayed = (sceneName) => {
        const appropiateScene = sceneName === 'roomMap';
        const collapsed = this.props.mapViewState.createRoomCollapsed;
        const button = <CancelButton onPress={this.cancelRoomCreation}/>;
        return appropiateScene && !collapsed ? button : undefined;

    };


    render() {
        const {highlightFriendsButton, children, openDrawer, scene} = this.props;
        const sceneName = (scene.children === undefined) ? this.state.lastScene : scene.children[0].children[0].name;
        return (
            <Container>
                <Header left={<DrawerButton openDrawer={openDrawer}/>}
                        titleStyle={{width: 200, color: '#fff'}}
                        title={this.resolveTitleForScene(sceneName)}
                        right={this.resolveIfCancelButtonShouldBeDisplayed(sceneName)}/>
                <Container>
                    {children}
                    <View style={{zIndex: 100}}>
                        <StyleProvider style={getTheme(commonColor)}>
                            <Footer style={{borderTopWidth: 1, borderColor: '#cacaca'}}>
                                <FooterTab>
                                    <Button active={sceneName === 'roomList'}
                                            onPress={() => Actions.roomList()}>
                                        <Icon ios="ios-paper-outline" android="md-list"/>
                                    </Button>
                                    <Button active={sceneName === 'roomMap'} onPress={() => {
                                        Actions.roomMap()
                                    }}>
                                        <Icon ios="ios-compass" android="md-compass"/>
                                    </Button>
                                    <Button active={sceneName === 'friends'} onPress={() => {
                                        Actions.friends()
                                    }}>
                                        <View style={{flexDirection: 'row'}}>
                                            <View style={{alignItems: "center"}}>
                                                <Icon ios='ios-contact' android='md-contact'/>
                                            </View>
                                            {renderFriendInfo(highlightFriendsButton)}
                                        </View>
                                    </Button>
                                </FooterTab>
                            </Footer>
                        </StyleProvider>
                    </View>
                </Container>
            </Container>
        )
    }
}

const renderFriendInfo = (highlight) => {
    if (highlight) {
        return (
            <NativeView style={{height: 12, width: 12,}}>
                <Icon ios="ios-mail" android='md-mail' style={{color: 'green', fontSize: 15}}/>
            </NativeView>)
    } else {
        return null;
    }

};

const commonColor = {
    // Footer
    footerHeight: 40,
    footerDefaultBg: '#f6f6f6',

// FooterTab
    tabBarTextColor: '#7d8d91',
    tabBarActiveTextColor: '#1796fb',
    tabActiveBgColor: 'transparent'
};

const styles = {
    tabButton: {
        height: 40,
        backgroundColor: 'transparent'
    },
};

export {FooterNavi};
