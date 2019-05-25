const express = require('express')
const router = express.Router()

const Profile = require('../models/profile')

router.post('/', (req, res) => {
    const id = req.uid
    const uid = req.body.uid

    const reduce = user => {
        if (user.minimage.data) {
            img = user.minimage.data.toString('base64')
        }
        const data = {
            fn: user.firstName,
            ln: user.lastName,
            image: {
                data: img,
                contentType: user.image.contentType
            }
            
        }
        res.json(data)
    }

    if (uid) {
        Profile.findById(uid).then(user => {
            if (user) {
                reduce(user)
            }
        }).catch(() => {
            res.json({ "msg": "Invalid!" })
        })
    } else {
        Profile.findById(id).then(user => {
            if (user) {
                reduce(user)
            }
        }).catch(() => {
            res.json({ "msg": "Invalid!" })
        })
    }

})

module.exports = router