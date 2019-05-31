const express = require('express')
const router = express.Router()
const Profile = require('../models/profile')

const info = (user) => {
    if (user.minimage.data) {
        img1 = user.minimage.data.toString('base64')
    }
    if (user.image.data) {
        img2 = user.image.data.toString('base64')
    }
    if (user.coverpic.data) {
        coverpic = user.coverpic.data.toString('base64')
    }
    user = user.toJSON()
    delete user.email
    delete user.password
    delete user.chats
    delete user.updatedAt
    if (user.minimage) {
        user.minimage.data = img1
    }
    if (user.image) {
        user.image.data = img2
    }
    if (user.coverpic) {
        user.coverpic.data = coverpic
    }
    return user
}

router.post('/', (req, res) => {
    const id = req.uid
    let uid = req.body.uid
    
    if (uid) {
        Profile.findOne({ userName: uid }).then(user => {
            if (user) {
                return res.json(info(user))
            } else {
                Profile.findById(uid).then(user => {
                    if (user) {
                        res.json(info(user))
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
                if (user.coverpic.data) {
                    coverpic = user.coverpic.data.toString('base64')
                }
                user = user.toJSON()
                delete user.password
                if (user.minimage) {
                    user.minimage.data = img
                }
                if (user.image) {
                    user.image.data = imgdp
                }
                if (user.coverpic) {
                    user.coverpic.data = coverpic
                }
                res.json(user)
            }
        }).catch(() => {
            res.json({ "msg": "Invalid!" })
        })
    }
})

router.post('/mininfo', async (req, res) => {
    let uid = req.body.uid
    const data = await Profile.findById(uid)
    let user = {}
    if (data.minimage) {
        let i = {}
        i.data = data.minimage.data.toString('base64')
        i.contentType = data.minimage.contentType
        user.minimage = i
    }
    if (data.userName) {
        user.userName = data.userName
    }
    else {
        user.userName = data._id
    }
    user.firstName = data.firstName
    user.lastName = data.lastName
    user.friends = data.friends
    res.json(user)
})

router.post('/friends', async (req, res) => {
    let uid = req.body.uid
    const data = await Profile.findById(uid)
    let user = {}
    if (data.image) {
        let i = {}
        i.data = data.image.data.toString('base64')
        i.contentType = data.image.contentType
        user.image = i
    }
    if (data.coverpic) {
        let i = {}
        i.data = data.coverpic.data.toString('base64')
        i.contentType = data.coverpic.contentType
        user.coverpic = i
    }
    if (data.userName) {
        user.userName = data.userName
    }
    else {
        user.userName = data._id
    }
    user.firstName = data.firstName
    user.lastName = data.lastName
    user.friends = data.friends
    res.json(user)
})

module.exports = router