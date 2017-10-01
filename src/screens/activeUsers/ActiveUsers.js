import {connect} from "react-redux";
import ActiveUsersView from "./ActiveUsersView";

function mapStateToProps(state, ownProps) {
    const room = Object.assign({}, state.rooms[ownProps.roomId] || {});
    const currentUserUid = state.auth.user.uid;
    return {room, currentUserUid}
}

export default connect(mapStateToProps)(ActiveUsersView);