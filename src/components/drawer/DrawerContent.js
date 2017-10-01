import React, {Component} from 'react';
import DrawerHeader from './DrawerHeader';
import {
    Container,
    Content,
    ListItem,
    Text,
    Switch,
    Left,
    Right,
    Body,
    Icon,
    Footer,
    FooterTab,
    Button,
    StyleProvider,
    getTheme
} from 'native-base';
import I18n from '../../utils/Dictionary';
import {Actions} from 'react-native-router-flux';
import Collapsible from 'react-native-collapsible';
import NotificationSettings from './NotificationSettings';
import CodePush from "react-native-code-push";

export default class DrawerContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        }
    }

    toggleExpanded = () => {
        this.setState({collapsed: !this.state.collapsed});
    };

    render() {
        const {user, actionProps, notifications, setNotifications, setBackgroundGeo, bgGeo} = this.props;
        const {globalSetting} = notifications;
        if (!user) {
            return null;
        }
        return (
            <Container style={styles.controlPanel}>
                <DrawerHeader user={user}/>
                <Content style={styles.drawerBodyContainer}>
                    <ListItem icon button onPress={() => {
                        Actions.userProfile({userToShow: user})
                    }}>
                        <Left>
                            <Icon name="contact" style={styles.itemIcon}/>
                        </Left>
                        <Body>
                        <Text style={styles.itemText}>{I18n.t('profile')}</Text>
                        </Body>
                    </ListItem>


                    <ListItem icon button onPress={this.toggleExpanded}>
                        <Left>
                            <Icon name="notifications" style={styles.itemIcon}/>
                        </Left>
                        <Body>
                        <Text style={styles.itemText}>{I18n.t('notifications')}</Text>
                        </Body>
                        <Right>
                            <Icon name="arrow-down"/>
                        </Right>
                    </ListItem>

                    <Collapsible collapsed={this.state.collapsed}>
                        <NotificationSettings
                            setNotifications={setNotifications}
                            globalSetting={globalSetting}
                            notifications={notifications}/>
                    </Collapsible>
                    <ListItem icon button onPress={() => {
                        setBackgroundGeo(!bgGeo)
                    }}>
                        <Left>
                            <Icon name="disc" button style={styles.itemIcon}/>
                        </Left>
                        <Body>
                        <Text style={styles.itemText}>{I18n.t('bg_geo_setting')}</Text>
                        </Body>
                        <Right>
                            <Switch
                                value={bgGeo}
                                onValueChange={(value) => setBackgroundGeo(value)}/>
                        </Right>
                    </ListItem>
                </Content>
                <StyleProvider style={getTheme(commonColor)}>
                    <Footer style={styles.drawerFooter}>
                        <FooterTab>
                            <Button button onPress={actionProps.logout}>
                                <Text>{I18n.t('logout')}</Text>
                            </Button>
                        </FooterTab>
                    </Footer>

                </StyleProvider>
            </Container>
        )
    }
}

const commonColor = {
    // Footer
    footerHeight: 40,
    footerDefaultBg: '#f6f6f6',

// FooterTab
    tabBarTextColor: '#4f585c',
    tabBarTextSize: 14,
    tabActiveBgColor: 'transparent',
};

const styles = {
    itemIcon: {
        color: "#4f585c"
    },
    itemText: {
        color: '#4f585c'
    },
    controlPanel: {
        backgroundColor: 'rgb(255, 255, 255)',
    },
    controlPanelWelcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 25,
        color: 'white',
        fontWeight: 'bold',
    },
    drawerBodyContainer: {
        backgroundColor: 'rgb(255, 255, 255)',
    },
    drawerFooter: {
        height: 40,
        borderTopWidth: 1,
        borderColor: '#cacaca',
        borderRightWidth: 1
    }
};