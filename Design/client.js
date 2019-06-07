const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const http = require('http')
const socketIO = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const PORT = process.env.PORT || 80

mongoose.connect('mongodb+srv://kad:kadmedia@kadmedia-6lyjf.mongodb.net/media?retryWrites=true', { useNewUrlParser: true, useCreateIndex: true, reconnectTries: 5 }).then(() => {
    console.log('MongoDB Success')
    conn = true
}).catch(() => {
    console.log('MongoDb Failed')
})

app.use(session({
    cookie: { sameSite: true },
    resave: false,
    saveUninitialized: false,
    secret: 'krishcool',
    store: new MongoStore({ mongooseConnection: mongoose.connection, autoRemove: 'native' })
}))

app.locals.pretty = true
app.set('view engine', 'pug')
app.set('views', './pages')
app.use(flash())
app.use(express.static('assets'))
app.use(express.urlencoded({ extended: false }))

app.use((req, res, next) => {
    // res.locals.uri = 'https://api.kadmedia.tk/'
    res.locals.uri = 'http://localhost:8000/'
    res.locals.errmsg = req.flash('err')
    res.locals.sucmsg = req.flash('suc')
    res.locals.reg = req.flash('reg')
    res.locals.fn = req.flash('fn')
    res.locals.ln = req.flash('ln')
    res.locals.em = req.flash('em')
    next()
})

const logged = (req, res, next) => {
    const token = req.session.token
    if(typeof token === 'undefined') {
        req.flash('err', "Please Log In to Continue")
        res.redirect('/')
    } else {
        next()
    }
}

const getSID = async (str) => {
    const sid = str.split(';')
    for (i = 0; i < sid.length; i++) {
        tmp = sid[i]
        if (tmp.includes('connect')) {
            start = tmp.indexOf('=')
            s = tmp.substring(start + 1)
            return s
        }
    }
}

app.error = ''
app.users = []

/* Socket Connections */
app.io = io

/* app.io.on('connection', (socket) => {
    const ssid = getSID(socket.handshake.headers.cookie)
    for (i = 0; i < app.users; i++) {
        user = app.users[i]
        if (user.sid === ssid) {
            socket.join(user.uid)
        }
    }
    
}) */


/* Socket Connections */

const navbar = require('./routes/navbar')
app.get('/favicon.ico', (req, res) => res.status(204))
app.use('/', require('./routes/auth'))
app.use('/newsfeed', logged, navbar, require('./routes/newsfeed'))
app.use('/profile', logged, navbar, require('./routes/profile'))
app.use('/search', logged, navbar, require('./routes/search'))
app.use('/Personal-Settings', logged, navbar, require('./routes/settings1'))
app.use('/Change-Profile-Picture', logged, navbar, require('./routes/settings2'))
app.use('/Account-Settings', logged, navbar, require('./routes/settings3'))
app.use('/Change-Cover-Picture', logged, navbar, require('./routes/settings4'))
app.use('/friends', logged, navbar, require('./routes/friends'))
app.use('/posts', logged, navbar, require('./routes/posts'))
app.use('/logout', logged, require('./routes/logout'))

app.all('*', (req, res) => {
    res.redirect('/')
})

server.listen(PORT, console.log(`Server running on ${PORT}`))