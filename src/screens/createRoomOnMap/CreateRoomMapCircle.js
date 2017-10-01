import React, {Component} from 'react';
import MapView from 'react-native-maps';
import {connect} from "react-redux";
import ROOM_TYPE from '../../actions/initizalizer/ROOM_TYPE';

class CreateRoomMap extends Component {


    render() {
        const {latitude, longitude} = this.props.coords;
        return (
                    <MapView.Circle
                        key={(ROOM_TYPE[this.props.roomType].radius * longitude * latitude).toString()}
                        center={{latitude, longitude}}
                        radius={ROOM_TYPE[this.props.roomType].radius * 1000}
                        fillColor="rgba(0, 0, 0, 0.2)"
                        strokeColor="rgba(0, 0, 0, 0.2)"/>
        )
    }
}


const mapStateToProps = ({form: {createPublicRoom: {values}}, position}) => {
    return {...values, ...position}
};

export default connect(mapStateToProps, null)(CreateRoomMap);