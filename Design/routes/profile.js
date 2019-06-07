const express = require('express')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const router = express.Router();


router.get('/', async (req, res) => {
    const data = req.data
    const pending = req.pending
    let friends = []
    const accepted = data.friends.accepted.reverse()
    for (i = 0; i < accepted.length && i < 6; i++) {
        p = new URLSearchParams()
        p.append('uid', accepted[i])
        const f = await fetch(res.locals.uri + 'getinfo/friends/', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + req.session.token
            },
            body: p
        }).then(res => res.json())
        friends.push(f)
    }
    let posts = await fetch(res.locals.uri + 'getpost/', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        }
    }).then(res => res.json())
    for (i = 0; i < posts.length; i++) {
        posts[i].likestate = false
        if (posts[i].likes.indexOf(req.data._id) > -1) {
            posts[i].likestate = true
        }
    }
    return res.render('profile', { data, friends, pending, posts })
})

router.get('/about', async (req, res) => {
    const data = req.data
    const pending = req.pending
    return res.render('about', { data, pending })
})

router.get('/friends', async (req, res) => {
    const data = req.data
    const pending = req.pending
    let friends = []
    const accepted = data.friends.accepted.reverse()
    for (i = 0; i < accepted.length; i++) {
        p = new URLSearchParams()
        p.append('uid', accepted[i])
        const f = await fetch(res.locals.uri + 'getinfo/friends/', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + req.session.token
            },
            body: p
        }).then(res => res.json())
        let c = 0
        for (a = 0; a < data.friends.accepted.length; a++) {
            for (b = 0; b < f.friends.accepted.length; b++) {
                if (data.friends.accepted[a] == f.friends.accepted[b]) {
                    c += 1
                }
            }
        }
        f.mutual = c
        friends.push(f)
    }
    return res.render('friends', { data, pending, friends })
})

router.get('/:id', async (req, res) => {
    const uid = req.params.id
    const data = req.data
    const pending = req.pending
    if (data.msg || data.userName === uid || data._id === uid) {
        return res.redirect('/profile')
    }
    p = new URLSearchParams()
    p.append('uid', uid)
    let frd = await fetch(res.locals.uri + 'getinfo', {
        method: 'POST',
        body: p,
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        }
    }).then(res => res.json())
    if (frd.msg) {
        return res.redirect('/profile')
    }
    if (!frd.userName) {
        frd.userName = frd._id
    }
    let stat = 0
    if (data.friends.accepted.indexOf(frd._id) >= 0) {
        stat = 1
    } else if (data.friends.received.indexOf(frd._id) >= 0) {
        stat = 2
    } else if (data.friends.sent.indexOf(frd._id) >= 0) {
        stat = 3
    }
    let friends = []
    const accepted = frd.friends.accepted.reverse()
    for (i = 0; i < accepted.length && i < 6; i++) {
        bd = new URLSearchParams()
        bd.append('uid', accepted[i])
        const f = await fetch(res.locals.uri + 'getinfo/friends/', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + req.session.token
            },
            body: bd
        }).then(res => res.json())
        friends.push(f)
    }
    p = new URLSearchParams()
    p.append('uid', frd._id)
    let posts = await fetch(res.locals.uri + 'getpost/', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        },
        body: p
    }).then(res => res.json())
    for (i = 0; i < posts.length; i++) {
        posts[i].likestate = false
        if (posts[i].likes.indexOf(req.data._id) > -1) {
            posts[i].likestate = true
        }
    }
    return res.render('pffrd', { data, frd, stat, friends, pending, posts })
})

router.get('/:id/about', async (req, res) => {
    const uid = req.params.id
    const data = req.data
    const pending = req.pending
    if (data.msg || data.userName === uid || data._id === uid) {
        return res.redirect('/profile')
    }
    const p = new URLSearchParams()
    p.append('uid', uid)
    let frd = await fetch(res.locals.uri + 'getinfo', {
        method: 'POST',
        body: p,
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        }
    }).then(res => res.json())
    if (frd.msg) {
        return res.redirect('/profile')
    }
    if (!frd.userName) {
        frd.userName = frd._id
    }
    return res.render('about1', { data, frd, stat, pending })
})

router.get('/:id/friends', async (req, res) => {
    const uid = req.params.id
    const data = req.data
    const pending = req.pending
    if (data.msg || data.userName === uid || data._id === uid) {
        return res.redirect('/profile')
    }
    p = new URLSearchParams()
    p.append('uid', uid)
    let frd = await fetch(res.locals.uri + 'getinfo', {
        method: 'POST',
        body: p,
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        }
    }).then(res => res.json())
    if (frd.msg) {
        return res.redirect('/profile')
    }
    if (!frd.userName) {
        frd.userName = frd._id
    }
    let friends = []
    const accepted = frd.friends.accepted.reverse()
    for (i = 0; i < accepted.length; i++) {
        p = new URLSearchParams()
        p.append('uid', accepted[i])
        const f = await fetch(res.locals.uri + 'getinfo/friends/', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + req.session.token
            },
            body: p
        }).then(res => res.json())
        let c = 0
        for (a = 0; a < data.friends.accepted.length; a++) {
            for (b = 0; b < f.friends.accepted.length; b++) {
                if (data.friends.accepted[a] == f.friends.accepted[b]) {
                    c += 1
                }
            }
        }
        f.mutual = c
        f.stat = 1
        friends.push(f)
    }
    return res.render('friends1', { data, frd, stat, pending, friends })
})

module.exports = router