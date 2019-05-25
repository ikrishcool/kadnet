const express = require('express')
const fetch = require('node-fetch')
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
        res.render('feed', { data })
    }).catch((err) => {
        console.log(err)
    })
    
})

module.exports = router