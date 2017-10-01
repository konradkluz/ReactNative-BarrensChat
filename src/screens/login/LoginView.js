import React, {Component, PropTypes} from 'react';
import {View, Image, StyleSheet, Text, TouchableOpacity, Dimensions} from 'react-native';
import {Container, Input, Spinner} from 'native-base';
import FadeInView from '../../components/FadeInView';
import {GOOGLE_PROVIDER, FACEBOOK_PROVIDER} from './../../actions/AuthProviderConst';


let {height, width} = Dimensions.get('window');

export default class LoginForm extends Component {

    static propTypes = {
        emailChanged: PropTypes.func,
        passwordChanged: PropTypes.func,
        loginUser: PropTypes.func,
        email: PropTypes.string,
        password: PropTypes.string,
        error: PropTypes.string,
        loading: PropTypes.bool

    };

    componentWillMount() {
        console.log('Login screen mounts')
    }

    componentWillUnmount() {
        console.log('Login screen unmounts')
    }

    errorOrSpinner(loading, error) {
        if (loading) {
            return (<Spinner style={{margin: 20}} color='#cacaca'/>)
        } else if (error.length > 0) {
            return ( <FadeInView>

                    <Text style={{backgroundColor: 'rgba(0,0,0,0)', color: 'orangered'}}>
                        {error}
                    </Text>

                </FadeInView>
            );
        }
        else return null;
    }

    loginAutomaticallyOrShowButtons(loginUser, authProvider, loading, error) {
        if(loading || error) {
            return ( <View style={{height: 20, alignItems: 'center', marginTop: 5}}>
                {this.errorOrSpinner(loading, error)}
            </View>);
        }

        else if (error.length > 0 || !authProvider) {
            return (this.renderLoginButtons(loginUser))
        }
        else if (!loading) {
            loginUser({type: authProvider});
        }
    }

    renderLoginButtons(loginUser) {
        const fbImg = require('./images/facebook.png');
        const googleImg = require('./images/google.png');

        return (
            <View>

                <TouchableOpacity onPress={() => loginUser({type: FACEBOOK_PROVIDER})}>
                    <Image source={fbImg} style={styles.socialImage}/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialTouchable} onPress={() => loginUser({type: GOOGLE_PROVIDER})}>
                    <Image source={googleImg} style={styles.socialImage}/>
                </TouchableOpacity>
            </View>
        )
    }

    render() {

        const backgroundImg = require('./images/loginBackground.png');
        const logoImg = require('./images/logo.png');

        const {loginUser, authProvider, loading, error} = this.props;

        return (
            <Image source={backgroundImg} style={styles.backgroundImage}>
                <Container style={{alignItems: 'center', marginTop: 50}}>

                    <Image source={logoImg} style={styles.logoImage}/>

                    {this.loginAutomaticallyOrShowButtons(loginUser, authProvider, loading, error)}
                </Container>
            </Image>
        );
    }
}


const styles = StyleSheet.create({


    socialImageContainer: {
        flex: 1,
    },

    backgroundImage: {
        height: null,
        width: null,
        flex: 1,
        resizeMode: 'cover',
    },

    logoImage: {
        height: 120,
        width: 320,
        alignSelf: 'center'

    },

    socialImage: {
        resizeMode: 'contain',
        height: 110,
        width: 320,
    }
});



