const express = require('express')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const router = express.Router();


router.post('/add', async (req, res) => {
    const p = new URLSearchParams()
    p.append('uid', req.body.uid)
    const data = await fetch(res.locals.uri + 'friends/add', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        },
        body: p
    }).then(res => res.json())
    res.send(data)
    
})

module.exports = router