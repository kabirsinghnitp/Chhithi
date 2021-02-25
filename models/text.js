const mongoose = require('mongoose')

const Text = mongoose.model('Text', {
    text: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        trim: true
    },
    createdAt: {
        type: String
    },
    commonroom: {
        type: String,
        trim: true
    }
})

module.exports = Text