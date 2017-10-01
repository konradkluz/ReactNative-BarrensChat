import React from 'react';
import {Scene} from 'react-native-router-flux';
import {
    Login,
    RoomList,
    RoomMap,
    Friends,
    CreateRoom,
    Room,
    DrawerOptions,
    ActiveUsers,
    UserProfile,
    FooterNavi,
    MainWrapper
} from './screens';
import {Actions, Router, ActionConst, Animations} from 'react-native-router-flux';
import {connect} from 'react-redux';

const Scenes = Actions.create(
    <Scene key='root'>
        <Scene key='login' type={ActionConst.RESET}>
            <Scene key='loginScene' component={Login} hideNavBar initial/>
        </Scene>
        <Scene key='main' component={MainWrapper} type={ActionConst.RESET}>
            <Scene key='wrap'>
                <Scene key="drawer" component={DrawerOptions} initial>
                    <Scene key="tab" component={FooterNavi} initial>
                        <Scene key='roomList' component={RoomList} hideNavBar  type={ActionConst.RESET}/>
                        <Scene key='roomMap' component={RoomMap} duration={600} hideNavBar initial
                               type={ActionConst.RESET}/>
                        <Scene key='friends' component={Friends} hideNavBar type={ActionConst.RESET}/>
                    </Scene>
                </Scene>
                <Scene key='createChat' component={CreateRoom} hideNavBar/>
                <Scene key='room' component={Room} hideNavBar/>
                <Scene key='activeUsers' component={ActiveUsers} hideNavBar/>
                <Scene key='userProfile' component={UserProfile} hideNavBar/>
            </Scene>
        </Scene>
    </Scene>
);

const RouterWithRedux = connect()(Router);
const ConnectedRouter = () => <RouterWithRedux scenes={Scenes}/>;

export default ConnectedRouter;

