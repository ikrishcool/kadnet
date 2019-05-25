const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

const check = (a) => {
    if (a === undefined) {
        return false
    } else if(a.trim()) {
        return true
    } else {
        return false
    }
}

const Profile = require('../models/profile')
router.post('/', (req, res) => {
    const { em, pw } = req.body
    let emchk = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if (check(em) && check(pw)) {
        if(emchk.test(em.trim())) {
            Profile.findOne({ email: em.trim() }).then(user => {
                if(user) {
                    verify(user, pw)
                } else {
                    Profile.findOne({ username: em.trim() }).then(user => {
                        if(user) {
                            verify(user, pw)
                        } else {
                            res.json({ "msg": "Account does not Exist! Register an Account!" })
                        }
                    })
                }
            }).catch(() => {
                res.json({ "msg": "Unknown Error! Try Again Later!" })
            })
        } else {
            res.json({ "msg": "Invalid Email ID!" })
        }
    } else {
        res.json({ "msg": "Email/User Name and Password Required!" })
    }
    
    async function verify(user) {
        if (user.password === pw.trim()) {
            let token = jwt.sign({ uid: user._id }, 'krishcool', { expiresIn: '12h' })
            res.json({ "token": token })
        } else {
            res.json({ "msg": "Invalid Password! Please try Again!" })
        }
    } 
})

module.exports = router