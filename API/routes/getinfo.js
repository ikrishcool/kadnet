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
    user.id = data._id
    if (data.minimage.data) {
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
    user._id = data._id
    if (data.image.data) {
        let i = {}
        i.data = data.image.data.toString('base64')
        i.contentType = data.image.contentType
        user.image = i
    }
    if (data.coverpic.data) {
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

router.post('/search', async (req, res) => {
    const id = req.uid
    const s = req.body.st.toLowerCase().trim()
    const result = []
    const data = await Profile.find()
    for (x = 0; x < data.length; x++) {
        const uid = data[x]._id
        if (id != uid) {
            fn = data[x].firstName.toLowerCase()
            ln = data[x].lastName.toLowerCase()
            if (fn.indexOf(s) > -1 || ln.indexOf(s) > -1) {
                let user = {}
                user._id = data[x]._id
                if (data[x].image.data) {
                    let i = {}
                    i.data = data[x].image.data.toString('base64')
                    i.contentType = data[x].image.contentType
                    user.image = i
                }
                if (data[x].coverpic.data) {
                    let i = {}
                    i.data = data[x].coverpic.data.toString('base64')
                    i.contentType = data[x].coverpic.contentType
                    user.coverpic = i
                }
                if (data[x].userName) {
                    user.userName = data[x].userName
                }
                else {
                    user.userName = data[x]._id
                }
                user.firstName = data[x].firstName
                user.lastName = data[x].lastName
                user.friends = data[x].friends
                result.push(user)
            }
        }
    }
    return res.json(result)
})

module.exports = router