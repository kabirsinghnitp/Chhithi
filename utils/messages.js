var moment = require('moment');
const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt:  moment(new Date().getTime()).utcOffset("+05:30").format('h:mm a')
    }
}

module.exports = {
    generateMessage
}
