const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const app = express()
app.use(cors({
    origin: (origin, cb) => {
        if (origin)
            console.log(origin)
        cb(null, true)
    }
}))
const PORT = process.env.PORT || 8000

let conn = false
mongoose.connect('mongodb://localhost/media', { useNewUrlParser: true, useCreateIndex: true, reconnectTries: 5 }).then(() => {
    console.log('MongoDB Success')
    conn = true
}).catch(() => {
    console.log('MongoDb Failed')
})

app.use('/hidden', express.static('public'))

const logged = async (req, res, next) => {
    const header = req.headers['authorization']
    if(typeof header !== 'undefined') {
        const token = header.split(' ')[1]
        jwt.verify(token, 'krishcool', (err, data) => {
            if(err) {
                res.json({ "msg": "unauthorized" })
            } else {
                req.uid = data.uid
                next()
            }
        })
    } else {
        res.json({ "msg": "unauthorized" })
    }
}

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/login', require('./routes/login'))
app.use('/register', require('./routes/register'))
app.use('/getinfo', logged, require('./routes/getinfo'))
app.use('/setinfo', logged, require('./routes/setinfo'))
app.use('/savepost', logged, require('./routes/savepost'))
app.use('/getpost', logged, require('./routes/getpost'))
app.use('/friends', logged, require('./routes/friends'))


app.get('/', (req, res) => {
    res.send('Welcome to Backend Server!')
})

app.all('*', (req, res) => {
    if (conn == false)
        res.send('102')
    else
        res.send('PNF')
})

app.listen(PORT, console.log(`Server running on ${PORT}`))
