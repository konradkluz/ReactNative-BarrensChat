import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Image
} from 'react-native';
import {connect} from 'react-redux'
import {sendPicture} from '../../actions';
import I18n from '../../utils/Dictionary';


class CustomCameraActions extends Component {

    static propTypes = {
        sendPicture: React.PropTypes.func.isRequired
    };

    goToPhotos() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            },
            title: I18n.t('select_photo'),
            cancelButtonTitle: I18n.t('cancel'),
            takePhotoButtonTitle: I18n.t('take_photo'),
            chooseFromLibraryButtonTitle: I18n.t('choose_photo_from_library'),
        };

        this.props.sendPicture(options);
    }

    render() {
        return (
            <View style={styles.imageContainerStyle}>
                <TouchableOpacity
                    onPress={this.goToPhotos.bind(this)}>
                    <Image style={styles.imageStyle} source={require('../../img/picture.png')}/>
                </TouchableOpacity>
            </View>
        );
    }
}

const
    styles = StyleSheet.create({
        imageContainerStyle: {
            flexDirection: 'row'
        },
        imageStyle: {
            width: 26,
            height: 26,
            marginLeft: 10,
            marginRight: 5,
            marginBottom: 10,
        }
    });

export
default

connect(
    null
    , {
        sendPicture
    }
)
(CustomCameraActions);