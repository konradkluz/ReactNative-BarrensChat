import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {approveInvitationToFriends, declineInvitationToFriends, createRoom, enterPrivateRoom} from "../../actions";
import FriendsView from "./FriendsView";

function mapStateToProps(state) {
    const {social} = state;
    const {user} = state.auth;
    return {social, user};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({approveInvitationToFriends, declineInvitationToFriends, createRoom, enterPrivateRoom}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendsView);