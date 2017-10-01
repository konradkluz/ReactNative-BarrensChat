import {connect} from "react-redux";
import {FooterNavi} from './FooterNaviView';
import {openDrawer} from '../../actions';
import {bindActionCreators} from 'redux';



function shouldHighlightFriendsButton(social) {
    const {unreadMessages, pendingInvitations} = social;
    return !_.isEmpty(unreadMessages) || pendingInvitations.length !== 0;
}

const mapStateToProps = ({social, scene, mapViewState}) => {
    const highlightFriendsButton = shouldHighlightFriendsButton(social);
    return {highlightFriendsButton, scene, mapViewState};
};

const mapDispatchToProps = (dispatch) => {
   return bindActionCreators({openDrawer, dispatch}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(FooterNavi);


