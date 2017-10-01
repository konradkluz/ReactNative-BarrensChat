import {LoginManager, AccessToken} from 'react-native-fbsdk';


const APP_PERMISSIONS = ['email', 'public_profile'];


const Fb = {
    login: (permissions = APP_PERMISSIONS) => {
        return new Promise((resolve, reject) => {

            AccessToken.getCurrentAccessToken()
                .then(FbAccessToken => resolve(FbAccessToken.accessToken)) //user has active token
                .catch(() => {
                return logIn(permissions, resolve, reject)
                }); // user needs to log in to get the token

        });
    },
    logout: () => {
        return new Promise((resolve, reject) => {
            LoginManager.logOut((error, data) => {
                if (!error) {
                    resolve(true);
                } else {
                    reject(error);
                }
            });
        });
    }
};


//helpers

const logIn = (permissions, resolve, reject) => {
    LoginManager.logInWithReadPermissions(permissions).then((result, error) => {
            if (result.isCancelled) {
                reject({error: 'User cancelled logging'})
            }
            else if (result) {
                AccessToken.getCurrentAccessToken().then(FbAccessToken => resolve(FbAccessToken.accessToken))
            } else {
                reject(error);
            }
        }
    ).catch(err => reject(err));
};

export default Fb;