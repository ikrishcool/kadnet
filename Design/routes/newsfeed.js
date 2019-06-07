const express = require('express')
const fetch = require('node-fetch')
const router = express.Router()


router.get('/', async (req, res) => {
    const data = req.data
    const pending = req.pending
    let posts = await fetch(res.locals.uri + 'getpost/all', {
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
    res.render('feed', { data, pending, posts })
})

module.exports = router