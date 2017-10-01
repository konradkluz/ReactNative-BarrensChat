import {connect} from 'react-redux'
import RoomListView from './RoomListView';
import {bindActionCreators} from 'redux';
import {unsubscribeFromRoom} from '../../actions';
import _ from 'lodash';

function mapStateToProps(state) {

    const rooms = _(state.rooms).map((val, roomId) => {
        return {...val, roomId}
    })
        .filter((room) => !!room.roomType || room.room === 'public')
        .value();

    const loadingRooms = state.loading.loadingRooms;


    return {rooms, loadingRooms};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({unsubscribeFromRoom}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomListView);