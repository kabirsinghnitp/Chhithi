const mongoose = require('mongoose')

const mongodb_uri = databaseLink
const local_mongodb_uri = 'mongodb://127.0.0.1:27017/Chhithi'
mongoose.connect(mongodb_uri, {
    useNewUrlParser:true,
    useCreateIndex: true,
    useFindAndModify: false
})
