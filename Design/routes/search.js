const express = require('express')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const router = express.Router()
const se = require('./emitter')
const pug = require('pug')

router.post('/', async (req, res) => {
    const data = req.data
    const pending = req.pending
    const s = req.body.search
    p = new URLSearchParams()
    p.append('st', s)
    let friends = await fetch(res.locals.uri + 'getinfo/search/', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        },
        body: p
    }).then(res => res.json())

    for (i = 0; i < friends.length; i++) {
        c = 0
        console.log(data.friends)
        console.log(friends[i].friends)
        for (a = 0; a < data.friends.accepted.length; a++) {
            console.log(data.friends.accepted[a])
            for (b = 0; b < friends[i].friends.accepted.length; b++) {
                console.log(friends[i].friends.accepted[b])
                if (data.friends.accepted[a] == friends[i].friends.accepted[b]) {
                    console.log('match')
                    c = c + 1
                }
            }
        }
        friends[i].mutual = c
        let stat = 0
        if (data.friends.accepted.indexOf(friends[i]._id) >= 0) {
            stat = 1
        } else if (data.friends.received.indexOf(friends[i]._id) >= 0) {
            stat = 2
        } else if (data.friends.sent.indexOf(friends[i]._id) >= 0) {
            stat = 3
        }
        friends[i].stat = stat
    }
    
    return res.render('search', { data, pending, friends, s })
})

module.exports = router