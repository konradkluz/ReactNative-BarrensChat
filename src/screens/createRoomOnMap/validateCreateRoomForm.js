import GeoFire from 'geofire';
import * as firebase from 'firebase';
import store from './../../store';
import {PUBLIC_ROOMS_REF, USER_ROOMS, ALL_ROOMS_LOC_REF} from '../../actions/DbRefsConst';
import _ from 'lodash';
import {SubmissionError} from 'redux-form'
import I18n from '../../utils/Dictionary';


export function validateCreateRoomForm(values, callbackWhenSuccess) {
    const lastCreatedRoomRef = firebase.database().ref(USER_ROOMS).child(store.getState().auth.user.uid).limitToLast(1);
    const roomsRef = firebase.database().ref(PUBLIC_ROOMS_REF);
    const {latitude, longitude} = store.getState().position.coords;
    const geoFireRooms = new GeoFire(firebase.database().ref(ALL_ROOMS_LOC_REF));
    const geoQuery = geoFireRooms.query({
        center: [latitude, longitude],
        radius: 5
    });

    const keyArr = [];
    return new Promise((resolve, reject) => {
        lastCreatedRoomRef.once('value', snap => {
            const room = snap.val();
            if (room) {
                const timeOfLastCreatedRoom = room[Object.keys(room)[0]].createdAt;
                const offsetRef = firebase.database().ref(".info/serverTimeOffset");
                offsetRef.on("value", (snap) => {
                    const offset = snap.val();
                    const now = new Date().getTime() + offset;
                    const differenceInMinutes = (now - timeOfLastCreatedRoom) / 60000;
                    if (differenceInMinutes < 10) {
                        reject(new SubmissionError({title: I18n.t('create_room_time_error'), _error: 'Time error'}));
                    }
                    resolve();
                });
            } else resolve();
        })
    }).then(() => new Promise(
        (resolve) => {
            geoQuery.on('key_entered', (key) => {
                console.log(key);
                keyArr.push(key);

            });
            resolve();
        }).then(() => new Promise((resolve) => {
        geoQuery.on('ready', () => {
            resolve(keyArr);
        });

    }))).then(keyArr => new Promise((resolve, reject) => {
        const titles = keyArr.map((key) => new Promise(resolve => {
            roomsRef.child(key).once('value', (snap) => {
                resolve(snap.val().title)
            })
        }));
        Promise.all(titles).then(titles => resolve(titles))
    })).then(titles => new Promise((resolve) => {
        const isTitleInDistance = _.includes(titles, values.title);
        if (isTitleInDistance) {
            geoQuery.cancel();
            throw new SubmissionError({title: I18n.t('chat_title_error'), _error: 'Duplicate title!'})
        }

        callbackWhenSuccess();
        geoQuery.cancel();
        resolve()
    }))
}


