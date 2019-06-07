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

router.post('/accept', async (req, res) => {
    const id = req.uid
    const uid = req.body.uid
    const user = await Profile.findById(uid)
    if (user) {
        let data = await Profile.findById(id)
        if (data.friends.received.indexOf(uid) >= 0 && user.friends.sent.indexOf(id) >= 0) {
            user.friends.sent.pull(id)
            data.friends.received.pull(uid)
            user.friends.accepted.push(id)
            data.friends.accepted.push(uid)
            await user.save()
            await data.save()
            res.json({
                msg: 'success'
            })
        } else {
            res.json({
                msg: 'invalid'
            })
        }
    } else {
        res.json({
            msg: 'invalid'
        })
    }
})

router.post('/remove', async (req, res) => {
    const id = req.uid
    const uid = req.body.uid
    const user = await Profile.findById(uid)
    if (user) {
        let data = await Profile.findById(id)
        if (user.friends.accepted.indexOf(id) >= 0 && data.friends.accepted.indexOf(uid) >= 0) {
            user.friends.accepted.pull(id)
            data.friends.accepted.pull(uid)
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
    } else {
        res.json({
            msg: 'invalid'
        })
    }
})

module.exports = router