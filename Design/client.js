const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const app = express()
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

const logged = async (req, res, next) => {
    const token = req.session.token
    if(typeof token === 'undefined') {
        req.flash('err', "Please Log In to Continue")
        res.redirect('/')
    } else {
        next()
    }
}

app.use('/', require('./routes/auth'))
app.use('/newsfeed', logged, require('./routes/newsfeed'))
app.use('/profile', logged, require('./routes/profile'))
app.use('/Personal-Settings', logged, require('./routes/settings1'))
app.use('/Account-Settings', logged, require('./routes/settings3'))
app.use('/logout', logged, require('./routes/logout'))

app.all('*', (req, res) => {
    res.redirect('/')
})

app.listen(PORT, console.log(`Server running on ${PORT}`))