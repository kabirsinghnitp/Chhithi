const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    first_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email must be valid')
            }
        }
    },
    password:  {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password is weak')
            }
        }
    },
    validation_code: {
        type: String,
        default: 0
    },
    active: {
        type: Boolean,
        default: 0
    },
    connected: {
        type: Boolean,
        default: 0
    },
    gender: {
        type: String,
        trim: true,
    },
    connectedRoom: {
        type: String,
        trim: true,
    }
})

const users = []

const addUser = ({ id, username, room, connectedRoom }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    connectedRoom = connectedRoom.trim().toLowerCase()

    // Validate the data
    // if (!username || !room) {
    //     return {
    //         error: 'Username and room are required!'
    //     }
    // }

    // Check for existing user
    // const existingUser = users.find((user) => {
    //     return user.room === room && user.username === username
    // })

    // Validate username
    // if (existingUser) {
    //     return {
    //         error: 'Username is in use!'
    //     }
    // }

    // Store user
    const user = { id, username, room, connectedRoom }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}



module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    User
}