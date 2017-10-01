import React, {Component} from "react";
import {Actions} from "react-native-router-flux";
import {Text} from "react-native";
import _ from "lodash";
import {Body, Container, Content, Left, ListItem, Thumbnail} from "native-base";
import {Header} from './../../components';
import I18n from "../../utils/Dictionary";

export default class ActiveUsersView extends Component {


    renderAvatar(photoURL) {
        if (photoURL) {
            return <Thumbnail small source={{uri: photoURL}}/>
        } else {
            return <Thumbnail small source={require('../../img/person-flat.png')}/>
        }
    }

    renderListItems(usersInRoom, currentUserUid) {
        return _(usersInRoom).omitBy((value, key) => key === currentUserUid)
            .map(
            user =>
            <ListItem button avatar onPress={()=>{Actions.userProfile({userToShow: user})}} key={user.uid}>
                <Left>
                    {this.renderAvatar(user.photoURL)}
                </Left>
                <Body>
                <Text>{user.displayName}</Text>
                </Body>
            </ListItem>
        ).value();
    }

    renderUsersList(usersInRoom, currentUserUid) {
        return (
            <Container>
                <Content>
                    {this.renderListItems(usersInRoom, currentUserUid)}
                </Content>
            </Container>
        )
    }

    render() {
        const {room: {usersInRoom}, currentUserUid} = this.props;

        return (
            <Container style={{backgroundColor: '#ececec'}}>
                <Header title={I18n.t('active_users')} titleStyle={{width: 200, color: '#fff'}}/>
                {this.renderUsersList(usersInRoom, currentUserUid)}
            </Container>
        )
    }
}