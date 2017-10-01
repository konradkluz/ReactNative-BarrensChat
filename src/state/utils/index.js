

function processNumberOfUsersInRoom(roomProps, roomId) {
    const roomValues = roomProps;
    roomValues.usersInRoom = roomValues.usersInRoom || {};
    roomValues.numberOfUsersInRoom = Object.keys(roomValues.usersInRoom).length;
    return {[roomId]: roomValues}
}


export function addRoom(state, action) {
    if(action.roomProps){
        return Object.assign({}, state, _.merge({},
            processNumberOfUsersInRoom(action.roomProps, action.roomId),
            {
                [action.roomId]: {
                    isUserSubscribed: action.isUserSubscribed
                }
            })
        );
    }
    return state;
}




