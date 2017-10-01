import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import moment from 'moment/min/moment-with-locales.min';
import {utils} from 'react-native-gifted-chat';

export default class CustomDay extends React.Component {
    render() {
        if (!utils.isSameDay(this.props.currentMessage, this.props.previousMessage)) {
            //TODO switch case between all moments locales to check languages
            return (
                <View style={[styles.container, this.props.containerStyle]}>
                    <View style={[styles.wrapper, this.props.wrapperStyle]}>
                        <Text style={[styles.text, this.props.textStyle]}>
                            {moment(this.props.currentMessage.createdAt).locale(this.props.locale).format('ll').toUpperCase()}
                        </Text>
                    </View>
                </View>
            );
        }
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    wrapper: {
        // backgroundColor: '#ccc',
        // borderRadius: 10,
        // paddingLeft: 10,
        // paddingRight: 10,
        // paddingTop: 5,
        // paddingBottom: 5,
    },
    text: {
        backgroundColor: 'transparent',
        color: '#b2b2b2',
        fontSize: 12,
        fontWeight: '600',
    },
});

CustomDay.contextTypes = {
    getLocale: React.PropTypes.func,
};

CustomDay.defaultProps = {
    currentMessage: {
        // TODO test if crash when createdAt === null
        createdAt: null,
    },
    previousMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    textStyle: {},
    //TODO: remove in next major release
    isSameDay: utils.warnDeprecated(utils.isSameDay),
    isSameUser: utils.warnDeprecated(utils.isSameUser),
};

CustomDay.propTypes = {
    currentMessage: React.PropTypes.object,
    previousMessage: React.PropTypes.object,
    containerStyle: View.propTypes.style,
    wrapperStyle: View.propTypes.style,
    textStyle: Text.propTypes.style,
    //TODO: remove in next major release
    isSameDay: React.PropTypes.func,
    isSameUser: React.PropTypes.func,
};
