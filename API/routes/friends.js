const express = require('express')
const router = express.Router()

const Profile = require('../models/profile')

router.post('/add', async (req, res) => {
    const id = req.uid
    const uid = req.body.uid
    const user = await Profile.findById(uid)
    if (user) {
        let data = await Profile.findById(id)
        data.friends.sent.push(uid)
        user.friends.received.push(id)
        console.log(data.friends, user.friends)
        await data.save()
        await user.save()
        res.json({
            msg: 'success'
        })
    } else {
        res.json({
            msg: 'invalid'
        })
    }
})

module.exports = router