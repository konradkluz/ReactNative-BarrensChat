import React, {Component} from "react";
import {Drawer} from "native-base";
import {DefaultRenderer} from "react-native-router-flux";
import DrawerContent from "../../components/drawer/DrawerContent";

export default class DrawerOptionsView extends Component {

    render() {
        const {children} = this.props.navigationState;
        const activeSceneName = children[0].children[0].name;
        const {drawer, user, notifications, setNotifications, setBackgroundGeo, bgGeo} = this.props;

        const controlPanel = <DrawerContent
            user={user}
            notifications={notifications}
            setNotifications={setNotifications}
            setBackgroundGeo={setBackgroundGeo}
            bgGeo={bgGeo}
            actionProps={{logout: this.props.logout}}/>;
        const drawerStyles = {
            mainOverlay: {
                backgroundColor: 'black',
                opacity: 0
            },
        };


        return (
            <Drawer
                open={drawer.isOpen}
                onOpen={this.props.openDrawer}
                onClose={this.props.closeDrawer}
                type="displace"
                content={controlPanel}
                styles={drawerStyles}
                tapToClose={true}
                openDrawerOffset={0.3}
                panOpenMask={activeSceneName === 'roomMap' ? 0 : .3}
                panCloseMask={.3}
                negotiatePan={true}
                tweenHandler={(ratio) => ({
                    mainOverlay: {
                        opacity: ratio / 2
                    },
                })}>
                <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate}/>
            </Drawer>
        );
    }
}