import {connect} from "react-redux";
import DrawerOptionsView from "./DrawerOptionsView";
import {closeDrawer, logout, openDrawer, setNotifications, setBackgroundGeo} from "../../actions";
import {bindActionCreators} from "redux";

function mapStateToProps(state){
    const {drawer} = state;
    const {user} = state.auth;
    const {notifications, bgGeo} = state.options;
    return {drawer, user, notifications, bgGeo};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({openDrawer, closeDrawer, logout, setNotifications, setBackgroundGeo}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerOptionsView);