const mongoose = require('mongoose')

const mongodb_uri = 'mongodb+srv://voidrohit:Rks&18158920@cluster0.oiqtt.mongodb.net/ChatApp?retryWrites=true&w=majority'
const local_mongodb_uri = 'mongodb://127.0.0.1:27017/ChatApp'
mongoose.connect(mongodb_uri, {
    useNewUrlParser:true,
    useCreateIndex: true,
    useFindAndModify: false
})
