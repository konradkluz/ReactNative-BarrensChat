import React, {Component, PropTypes} from 'react';
import {View, StyleSheet} from 'react-native';
import {Card, CardItem, Text, Left} from 'native-base';
import FadeInView from '../../components/FadeInView';
import {Actions} from 'react-native-router-flux';
import {EnterRoomBtn, LeaveRoomBtn} from '../../components';
import RoomItemMetaInfo from './RoomItemMetaInfo';

export default class RoomItem extends Component {

    static propTypes = {
        room: PropTypes.shape({
            roomId: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            roomType: PropTypes.string.isRequired,
            numberOfUsersInRoom: PropTypes.number.isRequired,
        })
    };


    routeToRoom = () => {
        //pass roomId prop so room component will know where from fetch room
        Actions.room({...this.props.room, roomPrivacy: 'public'});
    };


    render() {

        const {title, isUserSubscribed, roomId} = this.props.room;

        return (
            <FadeInView>
                <Card style={styles.card}>


                    <CardItem button cardBody onPress={this.routeToRoom}>
                        <Left>
                            <View style={{alignItems: 'flex-start'}}>
                                <View style={{alignSelf: 'flex-start', marginTop: 10}}>
                                    <Text style={styles.title}>{title}</Text>
                                </View>
                                <RoomItemMetaInfo room={this.props.room}/>
                            </View>



                        </Left>

                        <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                            {isUserSubscribed && <LeaveRoomBtn onPress={() => this.props.unsubscribe(roomId)}/>}

                        </View>
                    </CardItem>


                </Card>
            </FadeInView>
        );
    }


}

const styles = {
    card: {
        borderWidth: 0.5,
        borderRadius: 5,
        overflow: 'hidden',
        borderColor: 'darkgrey',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowRadius: 10,
        shadowOpacity: 0.6,
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