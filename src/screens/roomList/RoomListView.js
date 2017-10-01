import React, {Component, PropTypes} from 'react';
import {ScrollView, View} from 'react-native';
import {Container, Spinner} from 'native-base';
import {NoRoomsInDistanceView} from './../../components';
import RoomItem from './RoomItem';
import * as Animatable from 'react-native-animatable';


const AnimatableScrollView = Animatable.createAnimatableComponent(ScrollView);

export default class RoomListView extends Component {

    static propTypes = {
        rooms: PropTypes.array,
    };

    renderRow = () => {
        return this.props.rooms
            .map(room => <RoomItem key={room.roomId} room={room} unsubscribe={this.props.unsubscribeFromRoom}/>);
    };

    render() {
        const {
            loadingRooms,
            rooms,
        } = this.props;

        return (

            <Container style={{backgroundColor: 'white'}}>
                <View style={{flex: 1}}>

                    {
                        (loadingRooms && <Spinner color={'#3a7094'} style={{flex: 1}}/>) ||

                        (rooms.length > 0 &&
                            <AnimatableScrollView
                                animation="bounceInUp"
                                duration={2100}>{this.renderRow()}
                            </AnimatableScrollView> ||
                            <NoRoomsInDistanceView/>
                        )
                    }
                </View>
            </Container>
        )
    }
}
