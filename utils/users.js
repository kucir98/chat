const users = [];

// Dołączenie do czatu
function userJoin(id, username, room) {
    const user = {id, username, room};

    users.push(user);

    return user;
}

// Pobranie info o userze
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User wychodzi
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Info o userach w danym pokoju
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}