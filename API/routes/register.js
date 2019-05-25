const express = require('express')
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
    const { fn, ln, em, pw } = req.body
    let emchk = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if (check(fn) && check(ln) && check(em) && check(pw)) {
        if (emchk.test(em.trim())) {
            if (pw.trim().length < 6) {
                res.json({ "msg": "Password should be atleast 6 characters!" })
            } else {
                Profile.findOne({ email: em.trim() }).then(user => {
                    if(user) {
                        res.json({ "msg": "Email ID already Registered! Log In!" })
                    } else {
                        const user = new Profile({
                            firstName: fn.trim(),
                            lastName: ln.trim(),
                            email: em.trim(),
                            password: pw.trim(),
                            createdAt: Date()
                        })
                        user.save().then(() => {
                            res.json({ "suc": "Account successfully Created! Please Log In!" })
                        }).catch(() => {
                            res.json({ "msg": "Unknown Error. Try Again!" })
                        })
                    }
                })
            }
        } else {
            res.json({ "msg": "Invalid Email ID!" })
        }
    } else {
        res.json({ "msg": "All fields are Required!" })
    }    
})

module.exports = router