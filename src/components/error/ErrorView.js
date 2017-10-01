import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {connect} from "react-redux";
import Collapsible from 'react-native-collapsible';
import I18n from '../../utils/Dictionary';


class ErrorView extends Component {


    render() {
        return (
            <Collapsible collapsed={this.props.isConnected} duration={1200}>
                <View style={styles.view}>
                    <Text style={styles.text}>{I18n.t('no_internet_connection')}</Text>
                </View>
            </Collapsible>
        )
    }
}


function mapStateToProps({connection}) {

    return {...connection};
}

const Error = connect(mapStateToProps)(ErrorView);


export {Error};


const styles = StyleSheet.create({
    view: {
        backgroundColor: 'red',
        height: 30

    },

    text: {
        textAlign: 'center'
    }
});