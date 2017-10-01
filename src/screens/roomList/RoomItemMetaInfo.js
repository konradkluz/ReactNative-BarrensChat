import React from 'react';
import {getRoomTranslation} from './../../actions/initizalizer/ROOM_TYPE';
import {Text, Icon, View, Card} from 'native-base';


const RoomItemMetaInfo = (props) => {
    const {numberOfUsersInRoom, roomType, isUserSubscribed} = props.room;

    return (
        <View style={styles.content}>
            <Icon active name='md-people'
                  style={{color: 'darkgrey', fontSize: 18, marginLeft: 10, marginRight: 10}}/>


            <Text style={{fontSize: 14, color: 'darkgrey'}}>
                {numberOfUsersInRoom}
            </Text>


            <Text style={styles.pipe}> | </Text>


            <Icon active name='ios-move' style={{color: 'darkgrey', fontSize: 18, marginRight: 10}}/>
            <Text style={{fontSize: 14, color: 'darkgrey'}}>
                {getRoomTranslation(roomType)}
            </Text>


            {isUserSubscribed &&
            <View style={styles.content}>
                <Text style={styles.pipe}> | </Text>
                <Icon active name="sync" style={{fontSize: 18, color: 'green'}}/>
            </View>}


        </View>)
};


const styles = {
    card: {
        alignSelf: 'flex-start',
        padding: 0.5,
        borderWidth: 0.5,
        borderColor: 'darkgrey'
    },
    title: {
        fontStyle: 'italic',
        fontSize: 30,
        color: 'darkslategray'
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0,
    },
    pipe: {
        fontSize: 14,
        color: 'darkgrey',
        margin: 10
    }
};

export default RoomItemMetaInfo;