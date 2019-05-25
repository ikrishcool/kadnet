const express = require('express')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const router = express.Router();

router.get('/', (req, res) => {
    fetch(res.locals.uri + 'getinfo', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        }
    }).then(res => res.json()).then(data => {
        if (data.msg) {
            return res.redirect('logout')
        }
        if (!data.userName) {
            data.un = data._id
        }
        return res.render('profile', { data })
    }).catch((err) => {
        console.log(err)
    })
})

router.get('/:id', (req, res) => {
    let uid = req.params.id
    const p = new URLSearchParams()
    p.append('uid', uid)
    fetch(res.locals.uri + 'getinfo', {
        method: 'POST',
        body: p,
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        }
    }).then(res => res.json()).then(data => {
        if (data.msg) {
            return res.redirect('/profile')
        } else {
            return res.render('profile', { data })
        }
    }).catch((err) => {
        console.log(err)
    })
})




module.exports = router