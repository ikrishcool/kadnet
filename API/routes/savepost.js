const express = require('express')
const multer = require('multer')
const fs = require('fs')

const router = express.Router()

const tmpstr = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: tmpstr })

const Post = require('../models/post')
const Profile = require('../models/profile')

const check = (a) => {
    if (a === undefined) {
        return false
    } else if(a.trim()) {
        return true
    } else {
        return false
    }
}

router.post('/', upload.single('img'), async (req, res) => {
    const id = req.uid
    const { text, pid, like, comment } = req.body
    if (check(pid)) {
        const post = await Post.findById(pid)
        if (check(like)) {
            if (post.likes.indexOf(id) > -1) {
                post.likes.pull(id)
            } else {
                post.likes.push(id)
            }
            await post.save()
            return res.json({ "msg": "success" })
        }
    } else if (check(text) || req.file) {
        const data = await Profile.findById(id)
        const p = new Post({
            pown: id,
            firstName: data.firstName,
            lastName: data.lastName,
        })
        if (data.minimage.data) {
            p.minimage = data.minimage
        }
        if (check(text)) {
            p.text = text.trim()
        }
        if (req.file) {
            p.image.contentType = req.file.mimetype
            p.image.data = fs.readFileSync(req.file.path)
            fs.unlinkSync(req.file.path)
        }
        await p.save()
        tmp = p
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
        return res.json({ "msg": "New Post Created!", "post": tmp })
    } else {
        return res.json({ "msg": "invalid" })
    }
})
/* router.post('/', upload.single('img'), (req, res) => {
    const id = req.uid
    const { text, pid, like, comment } = req.body

    const update = (post) => {
        post.save().then(p => {
            if (p.image.data) {
                img = p.image.data.toString('base64')
            }
            p = p.toJSON()
            if (p.image) {
                p.image.data = img
            }
            delete p.image
            res.json(p)
        }).catch(() => {
            res.json({ "msg": "Invalid" })
        })
    }

    if (check(pid) && (check(text) || req.file)) {
        Post.findById(pid).then(post => {
            if (post) {
                if (post.pown === id) {
                    if (check(text)) {
                        post.text = text.trim()
                    }
                    if (req.file) {
                        post.image.contentType = req.file.mimetype
                        post.image.data = fs.readFileSync(req.file.path)
                        fs.unlinkSync(req.file.path)
                    }
                    update(post)
                } else {
                    res.json({ "msg": "Unauthorized" })
                }
            } else {
                res.json({ "msg": "Invalid" })
            }
        }).catch(() => {
            res.json({ "msg": "Invalid" })
        })
    } else if (check(text) || req.file) {
        const p = new Post({
            pown: id
        })
        if (check(text)) {
            p.text = text.trim()
        }
        if (req.file) {
            p.image.contentType = req.file.mimetype
            p.image.data = fs.readFileSync(req.file.path)
            fs.unlinkSync(req.file.path)
        }
        update(p)
    } else if (check(pid) && check(like)) {
        Post.findById(pid).then(post => {
            if (post) {
                const l = post.likes.length
                if (like.trim() === '1') {
                    for (i = 0; i < l; i++) {
                        if (post.likes[i] === id) {
                            break
                        }
                    }
                    if (i === l) {
                        post.likes.push(id)
                        update(post)
                    } else {
                        res.json({ "msg": "Already Liked" })
                    }
                } else if (like.trim() === '0') {
                    for (i = 0; i < l; i++) {
                        if (post.likes[i] === id) {
                            break
                        }
                    }
                    if (i !== l) {
                        post.likes.pull(id)
                        update(post)
                    } else {
                        res.json({ "msg": "Already Unliked" })
                    }
                } else {
                    res.json({ "msg": "Invalid" })
                }
            } else {
                res.json({ "msg": "Invalid" })
            }
        }).catch(() => {
            res.json({ "msg": "Invalid" })
        })
    } else if (check(pid) && check(comment)) {
        Post.findById(pid).then(post => {
            if (post) {
                post.comment.push({ uid: id, message: comment })
                update(post)
            } else {
                res.json({ "msg": "Invalid" })
            }
        })
    } else {
        res.json({ "msg": "Invalid" })
    }
}) */

module.exports = router