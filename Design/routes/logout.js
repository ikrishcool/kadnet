const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {
    req.session.destroy()
    req.app.error = 'Your Session has Expired! Please Log In again to Continue!'
    res.redirect('/')
})

module.exports = router