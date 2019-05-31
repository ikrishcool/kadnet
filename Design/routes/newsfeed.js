const express = require('express')
const fetch = require('node-fetch')
const router = express.Router();


router.get('/', async (req, res) => {
    const data = await fetch(res.locals.uri + 'getinfo', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        }
    }).then(res => res.json())
    if (data.msg) {
        return res.redirect('logout')
    }
    let pending = []
    const received = data.friends.received.reverse()
    for (i = 0; i < received.length && i < 3; i++) {
        p = new URLSearchParams()
        p.append('uid', received[i])
        const f = await fetch(res.locals.uri + 'getinfo/mininfo/', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + req.session.token
            },
            body: p
        }).then(res => res.json())
        let c = 0
        for (a = 0; a < data.friends.accepted.length; a++) {
            for (b = 0; b < f.friends.accepted.length; b++) {
                if (data.friends.accepted[a] === f.friends.accepted[b]) {
                    c += 1
                }
            }
        }
        f.mutual = c
        pending.push(f)
    }
    res.render('feed', { data, pending })
})

module.exports = router