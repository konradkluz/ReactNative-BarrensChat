import RoomMapView from './RoomMapView';
import {connect} from 'react-redux';
import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {initRoomMapQuery, deinitRoomMapQuery, updateRoomMapQuery} from '../../actions';


const mapStateToProps = ({position, roomMap, rooms, mapViewState, region}) => {
    roomMap = _(roomMap).map((value, roomId) => {
        if (roomId in rooms) {
            value.inDistance = true;
            return ({...value, roomId})
        } else {
            value.inDistance = false;
            return ({...value, roomId});
        }
    });
    return {position, roomMap, mapViewState, region}
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({initRoomMapQuery, deinitRoomMapQuery, updateRoomMapQuery}, dispatch)
};


export default connect(mapStateToProps, mapDispatchToProps)(RoomMapView);



