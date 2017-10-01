import {connect} from 'react-redux';
import LoginView from './LoginView';
import {loginUser} from '../../actions';
import {bindActionCreators} from 'redux';


function mapStateToProps({auth}) {
    const {email, password, error, loading, authProvider} = auth;
    return {email, password, error, loading, authProvider};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({loginUser}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
