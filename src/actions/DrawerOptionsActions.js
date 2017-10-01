import {OPEN_DRAWER, CLOSE_DRAWER} from './ACTIONS';

export const openDrawer = () => {
    return {
        type: OPEN_DRAWER
    }
};

export const closeDrawer = () => {
    return {
        type: CLOSE_DRAWER
    }
};