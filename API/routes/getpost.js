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

router.post('/', (req, res) => {
    const id = req.uid
    const uid = req.body.uid

    if (check(uid)) {
        id = uid.trim()
    }
    Post.find({ pown: id }).sort({ 'updatedAt': 'desc' }).then(posts => {
        console.log(posts)
        //res.send({ "msg": "success" })
        res.send(posts)
    })

    
})

module.exports = router