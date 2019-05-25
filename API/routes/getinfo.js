const express = require('express')
const router = express.Router()
const Profile = require('../models/profile')

router.post('/', (req, res) => {
    const id = req.uid
    let uid = req.body.uid
    
    if (uid) {
        Profile.findOne({ userName: uid }).then(user => {
            if (user) {
                if (user.minimage.data) {
                    img = user.minimage.data.toString('base64')
                }
                user = user.toJSON()
                delete user.email
                delete user.password
                delete user.chats
                delete user.updatedAt
                delete user.image
                if (user.minimage) {
                    user.minimage.data = img
                }
                res.json(user)
            } else {
                Profile.findById(uid).then(user => {
                    if (user) {
                        if (user.minimage.data) {
                            img = user.minimage.data.toString('base64')
                        }
                        user = user.toJSON()
                        delete user.email
                        delete user.password
                        delete user.chats
                        delete user.updatedAt
                        delete user.image
                        if (user.minimage) {
                            user.minimage.data = img
                        }
                        res.json(user)
                    } else {
                        res.json({ "msg": "Invalid!" })
                    }
                }).catch(() => {
                    res.json({ "msg": "Invalid!" })
                })
            }
        }).catch(() => {
            res.json({ "msg": "Invalid!" })
        })
    } else {
        Profile.findById(id).then(user => {
            if (user) {
                if (user.minimage.data) {
                    img = user.minimage.data.toString('base64')
                }
                if (user.image.data) {
                    imgdp = user.image.data.toString('base64')
                }
                user = user.toJSON()
                delete user.password
                if (user.minimage) {
                    user.minimage.data = img
                }
                if (user.image) {
                    user.image.data = imgdp
                }
                res.json(user)
            }
        }).catch(() => {
            res.json({ "msg": "Invalid!" })
        })
    }
})

module.exports = router