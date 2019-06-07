const express = require('express')
const fetch = require('node-fetch')
const fd = require('form-data')
const multer = require('multer')
const fs = require('fs')
const router = express.Router()
const se = require('./emitter')
const pug = require('pug')

const tmpstr = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: tmpstr })

router.post('/add', upload.single('pic'), async (req, res) => {
    let p = new fd()
    if (req.file) {
        const rs = fs.createReadStream(req.file.path)
        p.append('img', rs)
    }
    if (req.body.msg) {
        p.append('text', req.body.msg)
    }
    const r = await fetch(res.locals.uri + 'savepost', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        },
        body: p
    }).then(res => res.json())
    if (req.file) {
        fs.unlinkSync(req.file.path)
    }
    res.send(r.msg)
    p = r.post
    const code = pug.renderFile('./pages/postsnippet.pug', { p })
    await se(req, req.data._id, 'post', code)
    for (const f of req.data.friends.accepted) {
        await se(req, f, 'post', code)
    }
})

router.post('/like', async (req, res) => {
    p = new URLSearchParams()
    p.append('pid', req.body.pid)
    p.append('like', req.body.state)
    const r = await fetch(res.locals.uri + 'savepost', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        },
        body: p
    }).then(res => res.json())
    res.json(r)
})

router.get('/:pid', async (req, res) => {
    const pid = req.params.pid
    const data = req.data
    const pending = req.pending
    bd = new URLSearchParams()
    bd.append('pid', pid)
    const p = await fetch(res.locals.uri + 'getpost/single', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        },
        body: bd
    }).then(res => res.json())
    let likes = []
    const ll = p.likes.reverse()
    for (i = 0; i < ll.length; i++) {
        lid = ll[i]
        bd = new URLSearchParams()
        bd.append('uid', lid)
        l = await fetch(res.locals.uri + 'getinfo/mininfo', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + req.session.token
            },
            body: bd
        }).then(res => res.json())
        likes.push(l)
    }
    res.render('singlepost', { data, pending, p, likes })
})

module.exports = router