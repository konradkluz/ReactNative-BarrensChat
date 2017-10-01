import {connect} from 'react-redux';
import CreateRoomView from './CreateRoomView';
import {createRoom} from '../../actions';
import {bindActionCreators} from 'redux';
import ROOM_TYPE from '../../actions/initizalizer/ROOM_TYPE';


function mapDispatchToProps(dispatch) {
    return bindActionCreators({createRoom}, dispatch)
}

function mapStateToProps({mapViewState, form: {createPublicRoom}}) {

    const selectedRoomType = createPublicRoom === undefined ? '' : createPublicRoom.values.roomType

    const initialValues = {
        initialValues: {
            title: '',
            roomType: ROOM_TYPE.MEDIUM.roomType
        }
    };


    return {...initialValues, ...mapViewState, selectedRoomType};
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRoomView);