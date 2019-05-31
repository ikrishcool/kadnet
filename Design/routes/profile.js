const express = require('express')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const router = express.Router();


router.get('/', async (req, res) => {
    let data = await fetch(res.locals.uri + 'getinfo', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        }
    }).then(res => res.json())
    if (data.msg) {
        return res.redirect('logout')
    }
    if (!data.userName) {
        data.un = data._id
    }
    let friends = [], pending = []
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
    // data.friends.accepted.push('5cee933552898225f8c6b3f5')
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
    return res.render('profile', { data, friends, pending })
})

router.get('/about', async (req, res) => {
    let data = await fetch(res.locals.uri + 'getinfo', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        }
    }).then(res => res.json())
    if (data.msg) {
        return res.redirect('logout')
    }
    if (!data.userName) {
        data.un = data._id
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
    return res.render('about', { data, pending })
})

router.get('/friends', async (req, res) => {
    let data = await fetch(res.locals.uri + 'getinfo', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        }
    }).then(res => res.json())
    if (data.msg) {
        return res.redirect('logout')
    }
    if (!data.userName) {
        data.un = data._id
    }
    let pending = [], friends = []
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
                if (data.friends.accepted[a] === f.friends.accepted[b]) {
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
    let uid = req.params.id
    let data = await fetch(res.locals.uri + 'getinfo', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        }
    }).then(res => res.json())
    if (!data.userName) {
        data.userName = data._id
    }
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
    let stat = 0
    if (data.friends.accepted.indexOf(frd._id) >= 0) {
        stat = 1
    } else if (data.friends.received.indexOf(frd._id) >= 0) {
        stat = 2
    } else if (data.friends.sent.indexOf(frd._id) >= 0) {
        stat = 3
    }
    let friends = [], pending = []
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
    return res.render('pffrd', { data, frd, stat, friends, pending })
})

router.get('/:id/about', async (req, res) => {
    let uid = req.params.id
    let data = await fetch(res.locals.uri + 'getinfo', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        }
    }).then(res => res.json())
    if (!data.userName) {
        data.userName = data._id
    }
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
    let stat = 0
    if (data.friends.accepted.indexOf(frd._id) >= 0) {
        stat = 1
    } else if (data.friends.received.indexOf(frd._id) >= 0) {
        stat = 2
    } else if (data.friends.sent.indexOf(frd._id) >= 0) {
        stat = 3
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
    return res.render('about1', { data, frd, stat, pending })
})

router.get('/:id/friends', async (req, res) => {
    let uid = req.params.id
    let data = await fetch(res.locals.uri + 'getinfo', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        }
    }).then(res => res.json())
    if (!data.userName) {
        data.userName = data._id
    }
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
    let stat = 0
    if (data.friends.accepted.indexOf(frd._id) >= 0) {
        stat = 1
    } else if (data.friends.received.indexOf(frd._id) >= 0) {
        stat = 2
    } else if (data.friends.sent.indexOf(frd._id) >= 0) {
        stat = 3
    }
    let pending = [], friends = []
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
                if (data.friends.accepted[a] === f.friends.accepted[b]) {
                    c += 1
                }
            }
        }
        f.mutual = c
        friends.push(f)
    }
    return res.render('friends1', { data, frd, stat, pending, friends })
})

module.exports = router