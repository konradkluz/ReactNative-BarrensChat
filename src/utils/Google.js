import {GoogleSignin} from 'react-native-google-signin';

//configure




const Google = {

    configue: () => {
        GoogleSignin.hasPlayServices({autoResolve: true}).then(() => {

            GoogleSignin.configure({
                iosClientId: '334625201053-ptd481hkpg6sa0fb68nvigo5enfmke2i.apps.googleusercontent.com'
            }).then((log) => console.log('Google sign in configured: ', log));
        })
            .catch((err) => {
                console.log("Play services error", err.code, err.message);
            });
    },


    login: () => {
        return new Promise((resolve, reject) => {
            GoogleSignin.signIn()
                .then((user) => {
                    resolve(user.accessToken);
                }).catch((err) => {
                    reject(err);
                })
                .done();
        });
    },
    logout: () => {
        return new Promise((resolve, reject) => {
            GoogleSignin.signOut()
                .then(() => {
                    resolve(true);
                }).catch((err) => {
                    reject(err);
                });
        });
    }
};


export default Google;


