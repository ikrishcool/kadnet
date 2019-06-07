const express = require('express')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const router = express.Router()
const se = require('./emitter')
const pug = require('pug')

router.post('/add', async (req, res) => {
    let user = req.data
    const p = new URLSearchParams()
    p.append('uid', req.body.uid)
    const data = await fetch(res.locals.uri + 'friends/add', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        },
        body: p
    }).then(res => res.json())
    res.json(data)
    if (data.msg === 'success') {
        bd = new URLSearchParams()
        bd.append('uid', req.body.uid)
        let f = await fetch(res.locals.uri + 'getinfo/mininfo/', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + req.session.token
            },
            body: bd
        }).then(res => res.json())
        let c = 0
        for (a = 0; a < user.friends.accepted.length; a++) {
            for (b = 0; b < f.friends.accepted.length; b++) {
                if (user.friends.accepted[a] === f.friends.accepted[b]) {
                    c += 1
                }
            }
        }
        if (user.userName) {
            user.userName = user.userName
        }
        else {
            user.userName = user._id
        }
        user.mutual = c
        f = user
        const code = pug.renderFile('./pages/frdnoti.pug', { f })
        await se(req, req.body.uid, 'frdreq', code)
        await se(req, req.body.uid, 'ownfrd', user._id)
    }
})

router.post('/accept', async (req, res) => {
    const user = req.data
    const p = new URLSearchParams()
    p.append('uid', req.body.uid)
    const data = await fetch(res.locals.uri + 'friends/accept', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        },
        body: p
    }).then(res => res.json())
    if (data.msg === 'success') {
        const user = await fetch(res.locals.uri + 'getinfo/mininfo', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + req.session.token
            },
            body: p
        }).then(res => res.json())
        
        const code = `<p class="dispmsg">You and <a href="/profile/${user.userName}">${user.firstName} ${user.lastName}</a> are now friends.</p>`
        data.code = code
    }
    res.json(data)
    if (data.msg === 'success') {
        const code1 = `<button type="button">Already Friends</button><button id="rmfd" type="button" data-uid="${user._id}">Remove Friend</button><a href="#">Message</a>`
        await se(req, req.body.uid, 'accfrd', code1)
    }
})

router.post('/remove', async (req, res) => {
    const user = req.data
    const p = new URLSearchParams()
    p.append('uid', req.body.uid)
    const data = await fetch(res.locals.uri + 'friends/remove', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        },
        body: p
    }).then(res => res.json())
    res.json(data)
    if (data.msg === 'success') {
        const code = `<button id="addfd" type="button" data-uid="${user._id}">Add Friend</button>`
        await se(req, req.body.uid, 'rmfrd', code)
    }
})

module.exports = router