import React, {Component} from 'react';
import {Text, View, Platform} from 'react-native';
import {Thumbnail} from 'native-base';

export default class DrawerHeader extends Component {

    renderAvatar() {
        const {user} = this.props;
        if (user.photoURL) {
            return <Thumbnail size={60} source={{uri: user.photoURL}}/>
        } else {
            return <Thumbnail size={60} source={require('../../img/person-flat.png')}/>
        }
    }

    render() {
        const {user} = this.props;

        return (
            <View style={[styles.card, styles.drawerHeaderContainer]}>
                {this.renderAvatar()}
                <Text style={styles.displayName}>{user.displayName}</Text>
            </View>)

    }
}

const styles = {
    displayName: {
      fontWeight: 'bold',
        marginTop: 5,
        color: '#e8e8e8'
    },
    drawerHeaderContainer: {
        paddingTop: 40,
        paddingBottom: 15,
        backgroundColor: '#1796fb',
        alignItems: 'center'
    },
    card: {
        zIndex: 100,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 5,
        shadowOpacity: 0.3,
    },
    drawerHeaderContent: {
        alignItems: 'center'
    },

};
