import {SEND_PICTURE, PICTURE_SENT} from './ACTIONS';
import {Platform} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob'
import * as firebase from 'firebase';

export const sendPicture = (imagePickerOptions) => {

    return(dispatch) => {
        ImagePicker.showImagePicker(imagePickerOptions, (response) => {
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                uploadImage(response.uri)
                    .then(url => {
                        dispatch({type: SEND_PICTURE, payload: url});
                    })
                    .catch(error => console.log(error));
            }
        });
    }
};

export const pictureSent = () => {
    return{
        type: PICTURE_SENT
    }
};


const uploadImage = (uri, mime = 'application/octet-stream') => {
    const OriginalBlob = window.Blob;
    const OriginalXMLHttpRequest = window.XMLHttpRequest;
    window.Blob = RNFetchBlob.polyfill.Blob;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;

    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;


    return new Promise((resolve, reject) => {
        const storage = firebase.storage();
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const sessionId = new Date().getTime();
        let uploadBlob = null;
        const imageRef = storage.ref('images').child(`${sessionId}`);

        fs.readFile(uploadUri, 'base64')
            .then((data) => {
                return Blob.build(data, { type: `${mime};BASE64` })
            })
            .then((blob) => {
                uploadBlob = blob;
                return imageRef.put(blob, { contentType: mime })
            })
            .then(() => {
                uploadBlob.close();
                return imageRef.getDownloadURL()
            })
            .then((url) => {
                resolve(url)
            })
            .then(() => {
                window.Blob = OriginalBlob;
                window.XMLHttpRequest = OriginalXMLHttpRequest;
            })
            .catch((error) => {
                reject(error)
            })
    })
};