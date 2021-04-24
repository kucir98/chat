const moment = require("moment");

function msgHeader(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = msgHeader;