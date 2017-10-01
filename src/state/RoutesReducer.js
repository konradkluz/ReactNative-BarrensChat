import { ActionConst } from 'react-native-router-flux';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action = {}) => {
    switch (action.type) {
        case ActionConst.FOCUS:
            return {
                ...action.scene,
            };

        case ActionConst.PUSH:
            return {...state};


        default:
            return state;
    }
}