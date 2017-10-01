import I18n from '../../utils/Dictionary';

class RoomType {
    constructor(name, radius){
        this.roomType = name;
        this.radius = radius;
    }

    getPath = () => `roomsLocations/${this.roomType}`;

}


const VERYSMALL = Object.freeze(new RoomType('VERYSMALL', 0.1));
const SMALL = Object.freeze(new RoomType('SMALL', 0.3));
const MEDIUM = Object.freeze(new RoomType('MEDIUM', 0.5));
const LARGE = Object.freeze(new RoomType('LARGE', 1));
const VERYLARGE = Object.freeze(new RoomType('VERYLARGE', 1.5));


export const getRoomTranslation = (roomType) => {
    switch (roomType) {
        case RoomTypes.VERYSMALL.roomType:
            return I18n.t(`${RoomTypes.VERYSMALL.roomType}`);
        case RoomTypes.SMALL.roomType:
            return I18n.t(`${RoomTypes.SMALL.roomType}`);
        case RoomTypes.MEDIUM.roomType:
            return I18n.t(`${RoomTypes.MEDIUM.roomType}`);
        case RoomTypes.LARGE.roomType:
            return I18n.t(`${RoomTypes.LARGE.roomType}`);
        case RoomTypes.VERYLARGE.roomType:
            return I18n.t(`${RoomTypes.VERYLARGE.roomType}`);

    }
};


const RoomTypes = {
    VERYSMALL,
    SMALL,
    MEDIUM,
    LARGE,
    VERYLARGE
};


export default RoomTypes;



