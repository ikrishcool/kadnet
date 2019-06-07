const fetch = require('node-fetch')
const se = require('./emitter')

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

const navbar = async (req, res, next) => {
    let data = await fetch(res.locals.uri + 'getinfo', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        }
    }).then(res => res.json())
    if (data.msg === 'unauthorized') {
        return res.redirect('/logout')
    }
    if (!data.userName) {
        data.userName = data._id
    }

    for (i = 0; i < req.app.users.length; i++) {
        user = req.app.users[i]
        if (user.uid === data._id) {
            break
        }
    }

    if (i == req.app.users.length) {
        const u = {}
        u.uid = data._id
        u.sid = await getSID(req.headers.cookie)
        req.app.users.push(u)
        console.log('New User Joined')
        console.log(u)
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
    req.data = data
    req.pending = pending
    next()
}

module.exports = navbar