const http = require('http')
const express = require('express')
const db = require('./db/mongoose')
require('dotenv').config()
const { addUser, removeUser, getUser, getUsersInRoom, User } = require('./models/user')
const Text = require('./models/text')
const nodemailer = require('nodemailer')
var sha256 = require('js-sha256')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require("cookie-parser")
const MongodbSession = require('connect-mongodb-session')(session)
const url = require('url');
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } = require('./utils/messages')
var moment = require('moment');

const mongodb_uri2 = 'mongodb+srv://voidrohit:Rks&18158920@cluster0.oiqtt.mongodb.net/ChatApp?retryWrites=true&w=majority'
const local = 'mongodb://127.0.0.1:27017/ChatAp'

const store = new MongodbSession({
    uri: mongodb_uri2,
    collestion: 'sessions'
})

const app = express()
const server =http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3030

app.use(cookieParser())
app.use(express.json())

app.use(express.static("Public"));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    cookie: {
        httpOnly: true,
        maxAge: null
    },
    secret: 'uniqueKey',   //********************************  change it man!! it must be secret  ******************************************//
    resave: false,
    saveUninitialized: false,
    store: store,
}))

const isAuth = (req, res, next) => {
    if(req.session.isAuth) {
        next()
    } else {
        console.log("false");
        res.redirect('/')
    }
}

let counter = 0

app.set('view engine','ejs');

app.get('/', (req, res) => {
    res.render("index", {name: "", cross: "", wrong: ""});
})

app.post('/users', (req, res) => {

    if(moment(new Date().getTime()).utcOffset("+05:30").format('h:mm a') > "11:53 pm" && moment(new Date().getTime()).utcOffset("+05:30").format('h:mm a') < "11:55 pm") {
        counter = 0
    } 
   
    const user = new User({
        first_name: req.body.first_name,
        username: req.body.username.trim().toLowerCase(),
        email: req.body.email,
        password: sha256(req.body.password),
        gender: req.body.gender,
        connectedRoom: req.body.username.trim().toLowerCase()
    })

    var mailquery = User.find({email: req.body.email}); 
    var usernamequery = User.find({username: req.body.username}); 

    mailquery.count(function (err, count) { 
        if (count === 0) {
            usernamequery.count(function (err, count2) {
                if (count2 === 0) {
                    user.save(function(err){

                        id = user._id
                        email = user.email
                        validation_code = sha256(user.username)
                        username = user.username

                        if( counter <= 450) {
                            console.log(counter);
                            
                            let transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'kabirsinghnitpatna@gmail.com' ,    // Sender email
                                    pass: 'Rks&18158920' // Sender password
                                }
                            });
                            
                            let mailOptions = {
                                from: 'kabirsinghnitpatna@gmail.com',
                                to: email,
                                subject: 'Activate',
                                text: `Please click on the link provided to activate the account https://chhithi.herokuapp.com/users/${email}/${validation_code}/${id}/${username}`
                                /////// Change text link while deploying
                            };
                            
                            transporter.sendMail(mailOptions, (err, data) => {
                                if (err) {
                                    res.render("message", {message: "Error occured"})
                                } else {
                                    res.render("message", {message: "Go to your gmail to verify the account"});
                                }
                        })
                    
                            counter++
                        } else if(counter > 450  && counter <= 900) {
                            console.log(counter);
                            
                            let transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'kabirsinghnitp2.0@gmail.com' ,    // Sender email
                                    pass: 'Kabir&18158920' // Sender password
                                }
                            });
                            
                            let mailOptions = {
                                from: 'kabirsinghnitp2.0@gmail.com', // Sender email
                                to: email,
                                subject: 'Activate',
                                text: `Please click on the link provided to activate the account https://chhithi.herokuapp.com/users/${email}/${validation_code}/${id}/${username}`
                                /////// Change text link while deploying
                            };
                            
                            transporter.sendMail(mailOptions, (err, data) => {
                                if (err) {
                                    res.render("message", {message: "Error occured"})
                                } else {
                                    res.render("message", {message: "Go to your gmail to verify the account"});
                                }
                            })
                    
                            counter++
                        } else if( counter > 900 && counter <= 1350) {
                            console.log(counter);
                            
                            let transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'kabirsinghnitp3.0@gmail.com' ,    // Sender email
                                    pass: 'Kabir&18158920' // Sender password
                                }
                            });
                            
                            let mailOptions = {
                                from: 'kabirsinghnitp3.0@gmail.com', // Sender email
                                to: email,
                                subject: 'Activate',
                                text: `Please click on the link provided to activate the account https://chhithi.herokuapp.com/users/${email}/${validation_code}/${id}/${username}`
                                /////// Change text link while deploying
                            };
                            
                            transporter.sendMail(mailOptions, (err, data) => {
                                if (err) {
                                    res.render("message", {message: "Error occured"})
                                } else {
                                    res.render("message", {message: "Go to your gmail to verify the account"});
                                }
                        })
                    
                            counter++
                        } else if( counter > 1365){
                            res.render("message", {message: "More than 1300 accounts created today. Try creating account tomorrow."})
                        }
                    
                })
                    } else {
                    res.render('index', { name: 'Username Already exist' , cross: "BACK TO LOGIN", wrong: ""})                  
                }
                })

            } else {
                res.render('index', { name: 'Email Already exist' , cross: "BACK TO LOGIN", wrong: ""})
            }
             
})
    
})

app.get('/users', (req, res) => {
    res.render("index", {name: "", cross: "", wrong: ""});
})


app.get('/users/:email/:code/:id/:username', (req, res) => {
    const email = req.params.email
    const validation_code = sha256(req.params.code)
    const _id= req.params.id
    const username = req.params.username

    User.findByIdAndUpdate(_id ,{"active": true, "validation_code": validation_code}, function(err, result){

        if(err){
            res.render("message", {message: "Error occured"});
        }
        else{
            res.render("message", {message: "Account verified. Go to login page"});
        }

    })
})

app.post('/reset', (req, res) => {
    email = req.body.email
    console.log(email);

    User.find({email: email}, {
    active: 0,
    _id: 1,
    first_name: 0,
    last_name: 0,
    username: 0,
    email: 0,
    password: 0,
    __v: 0}).then((users) => {

        validation_code = users[0]["validation_code"]
        id = users[0]["_id"]

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'kabirsinghnitp@gmail.com',    // Sender email
                pass: 'Rks&18158920'  // Sender password
            }
        });
        
        let mailOptions = {
            from: 'kabirsinghnitp@gmail.com',
            to: email,
            subject: 'Test',
            text: `Please click on the link provided to reset password https://chhithi.herokuapp.com/reset/${email}/${validation_code}/${id}`
            /////// Change text link while deploying
        };
        
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                res.render("message", {message: "Error occured"});
            } else {
                res.render("message", {message: "Go to your gmail to reset password"});
            }
    })

        
    }).catch((e) => {
        res.send(400).send(e)
    })

})

app.get('/reset/:email/:code/:id', (req, res) => {
    const email = req.params.email
    const validation_code = sha256(req.params.code)
    const id= req.params.id

    console.log(id);

    res.render("resetPassword", {id: id})

})

app.post('/signin', (req, res) => {
    email = req.body.email
    password = sha256(req.body.password)

    // remember = Boolean(req.body.remember)

    User.find({email: email}).then((users) => {

            emaildb = users[0]["email"]
            passworddb = users[0]["password"]
            _id = users[0]["_id"]
            username = users[0]["username"]
            active = users[0]["active"]

            if( active === true) {
                if( email == emaildb && password == passworddb ) {
                    req.session.isAuth = true
                    res.redirect(`/dashboard/${username}/${_id}`)
                } else {
                    res.render("index", {name: "", cross: "", wrong:"Wrong Credentials"})
                }
            } else {
                res.render("message", {message: "Please verify your account first then login"});
            }
        }).catch((e) => {
            res.render("index", {name: "", cross: "", wrong:"First Create Account"})
        })


})

app.get("/dashboard/:username/:id", isAuth, (req, res) => {
    const username = req.params.username
    const id = req.params.id

    User.find({username: username}).then((users) => {

        const username = users[0]["username"]
        const connectedRoom = users[0]["connectedRoom"]

        if(users[0]["connected"] === false) {
            if(users[0]["gender"] === "female") {
                User.find({gender: "male", connected: false}).countDocuments().then((gender) => {
                    count = gender
                    random = Math.floor(Math.random() * count); 
                    
                    User.find({gender: "male", connected: false}).then((males) => {

                        console.log(males.length);
                        console.log(random);
                        console.log(males[random]["username"]);
                        if(males.length == 0){
                            res.render("index", {name: "", cross: "", wrong:"Wait for boys to join"})
                        } else{
                            partner = males[random]["username"]

                        User.find({username: partner}).then((userid) => {
                            _id = userid[0]["_id"]
                            User.findByIdAndUpdate(_id ,{"connected": true}, function(err, result){
                                if(err){
                                    res.render("message", {message: "Error occured"});
                                } else {
                                console.log("done")
                                }
                            })

                            User.findByIdAndUpdate(id ,{"connected": true, "connectedRoom": partner}, function(err, result){
                            
                                if(err){
                                    res.render("message", {message: "Error occured"});
                                }
                                else{
                                    res.render("dashboard", {one: username, two: partner, id: _id})
                                }               
                        })

                        })
                        }

                        

                })
            }).catch((e) => {
            res.send(400).send(e)
            })
        } else {
            res.render("dashboard", {one: username, two: username, id: id})
        }

    } else {
        res.render("dashboard", {one: username, two: connectedRoom, id: id})
    }
        
    })

})

app.post('/chat/:one/:id', (req, res) => {
    username = req.params.one

    User.find({username: username}).then((user) => {
        room = user[0]["connectedRoom"]
        Text.find({commonoom: room}).then((texts) => {
            res.render("chat", {username: username, room: room, text: texts, connectedRoom: room})
        })     
    })
})

app.get('/chat/:one/:id', isAuth, (req, res) => {
    username = req.params.one
    id = req.params.id
    
    User.find({username: username}).then((user) => {
        room = user[0]["connectedRoom"]
        Text.find({commonroom: room}).then((texts) => {
            res.render("chat", {username: username, two: room, text: texts, connectedRoom: room, id: id})
        })        
    })   
})

app.post('/reset-password', (req, res) => {
    password = sha256(req.body.password)
    email = req.body.email ///// this is id

    User.findByIdAndUpdate(email ,{"password": password}, function(err, result){

        if(err){
            res.render("message", {message: "Error occured"});
        }
        else{
            res.render("message", {message: "Password reset successful! Go to login page"});
        }
    })
})

app.post('/logout', isAuth,(req, res) => {
    req.session.destroy((err) =>{
        if(err) throw err
        const name = ""
        const cross = ""
        res.render("index", {name: "", cross: "", wrong:""});
    })
})
app.post('/disconnect/:username', isAuth,(req, res) => {
    username = req.params.username

    console.log(username);

    User.find({username: username}).then((user) => {
        room = user[0]["connectedRoom"]
        User.find({connectedRoom: room}).updateMany({connected: false}).then((update) => {
            console.log(update);
        })
    })
    Text.find({commonroom: room}).remove().then((room2) => {
        console.log(room2);
    })
    req.session.destroy((err) =>{
        if(err) throw err
        const name = ""
        const cross = ""
        res.render("index", {name: "", cross: "", wrong:""});
    })

})

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', ({ username, room, connectedRoom}, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room, connectedRoom })

        if(error) {
            return callback(error)
        }
        
        socket.join(user.room)

        socket.emit('message', generateMessage("Admin", "Welcome!"))
        socket.broadcast.to(room).emit('message', generateMessage("Admin", `${user.username} has joined`))

    })

    socket.on('sendMessage', (message, callback) => {

        const user = getUser(socket.id)
        const filter = new Filter()
        filter.addWords('mc')

        console.log(message);

        let text = new Text({
            text: message,
            username: user.username,
            createdAt: moment(new Date().getTime()).utcOffset("+05:30").format('MMM Do, h:mm a'),
            commonroom: user.connectedRoom
        })

        text.save(function(err){
            // message = message.text
            console.log(text);
            let username1 = text.username
            let text2 = text.text
            let time = text.createdAt

            if(filter.isProfane(message)) {
                return callback(filter.clean(message))
            }
    
            io.to(user.room).emit('message', { username: username1, text: text2, createdAt: time })
            callback()
            
        })
    })

        socket.on('disconnect', () => {
            const user = removeUser(socket.id)
    
            if(user) {
                io.to(user.room).emit('message', generateMessage("Admin", `${user.username} left temporarily`))
            }
        })

})


server.listen(port, () => {
    console.log('Server is running on port ' + port)
})
