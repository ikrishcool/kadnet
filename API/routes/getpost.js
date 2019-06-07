const express = require('express')
const router = express.Router()

const Profile = require('../models/profile')
const Post = require('../models/post')

const check = (a) => {
    if (a === undefined) {
        return false
    } else if(a.trim()) {
        return true
    } else {
        return false
    }
}

const format = (tmp) => {
    if (tmp.minimage.data) {
        img1 = tmp.minimage.data.toString('base64')
    }
    if (tmp.image.data) {
        img2 = tmp.image.data.toString('base64')
    }
    tmp = tmp.toJSON()
    if (tmp.minimage) {
        tmp.minimage.data = img1
    }
    if (tmp.image) {
        tmp.image.data = img2
    }
    return tmp
}

router.post('/', (req, res) => {
    let id = req.uid
    const uid = req.body.uid

    if (check(uid)) {
        id = uid.trim()
    }
    Post.find({ pown: id }).sort({ 'updatedAt': 'desc' }).then(posts => {
        let p = []
        for (i = 0; i < posts.length; i++) {
            tmp = posts[i]
            tmp = format(tmp)
            p.push(tmp)
        }
        res.json(p)
    })
})

router.post('/all', async (req, res) => {
    let id = req.uid
    const data = await Profile.findById(id)
    const friends = data.friends.accepted
    const posts = await Post.find().sort({ 'updatedAt': 'desc' })
    let p = []
    for (i = 0; i < posts.length; i++) {
        tmp = posts[i]
        if (friends.indexOf(tmp.pown) >= 0) {
            tmp = format(tmp)
            p.push(tmp)
        }
        if (tmp.pown === id) {
            tmp = format(tmp)
            p.push(tmp)
        }
    }
    res.json(p)
})

router.post('/single', async (req, res) => {
    const pid = req.body.pid
    const post = await Post.findById(pid)
    tmp = post
    tmp = format(tmp)
    res.json(tmp)
})

module.exports = router