import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import UserProfileView from "./UserProfileView";
import {
    approveInvitationToFriends,
    checkIfShowAddToFriendsButton,
    declineInvitationToFriends,
    inviteToFriends,
    createRoom,
    removeFriend,
    removePrivateRoom,
    enterPrivateRoom
} from "../../actions";

function mapStateToProps(state) {
    const currentUser = state.auth.user;
    const {social} = state;

    return {currentUser, social}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        inviteToFriends,
        approveInvitationToFriends,
        declineInvitationToFriends,
        checkIfShowAddToFriendsButton,
        createRoom,
        removeFriend,
        removePrivateRoom,
        enterPrivateRoom
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileView);