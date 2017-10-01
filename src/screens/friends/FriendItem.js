import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {loadUser, markMessageAsRead} from "../../actions";
import FriendItemRow from "./FriendItemRow";

function mapStateToProps(state) {
    const {friendsDetails} = state;
    return {friendsDetails};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({loadUser, markMessageAsRead}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendItemRow);