const express = require('express')
const multer = require('multer')
const fs = require('fs')
const sharp = require('sharp')

const router = express.Router()

const tmpstr = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: tmpstr })

const Profile = require('../models/profile')

const check = (a) => {
    if (a === undefined) {
        return false
    } else {
        return true
    }
}

router.post('/', upload.single('pf'), async (req, res) => {
    
    const { fn, ln, un, loc, gen, ph } = req.body
    let { oem, nem, cem, opw, npw, cpw } = req.body
    let user = await Profile.findById(req.uid)
    let msg = {}
    
    // First name
    if (check(fn)) {
        if (fn.trim() === '') {
            msg.fn = 'First Name is Required!'
        } else if (user.firstName !== fn.trim()) {
            user.firstName = fn.trim()
            msg.fn = 'First Name Updated!'
        }
    }

    // Last Name
    if (check(ln)) {
        if (ln.trim() === '') {
            msg.ln = 'Last Name is Required!'
        } else if (user.lastName !== ln.trim()) {
            user.lastName = ln.trim()
            msg.ln = 'Last Name Updated!'
        }
    }

    // User Name
    if (check(un)) {
        if (un.trim() === '') {
            if (user.userName) {
                user.userName = undefined
                msg.un = 'UserName Removed'
            }
        } else {
            const test = await Profile.findOne({ userName: un.trim() })
            if (test) {
                msg.un = 'UserName Unavailable!'
            } else if (user.userName !== un.trim()) {
                user.userName = un.trim()
                msg.un = 'UserName Updated!'
            }
        }
    }

    // Location
    if (check(loc)) {
        if (loc.trim() === '') {
            if (user.location) {
                user.location = undefined
                msg.loc = 'Location Removed'
            }
        } else if (user.location !== loc.trim()) {
            user.location = loc.trim()
            msg.loc = 'Location Updated!'
        }
    }

    // Gender
    if (check(gen)) {
        if (gen.trim() === '') {
            if (user.gender) {
                user.gender = undefined
                msg.gen = 'Gender Removed'
            }
        } else if (user.gender !== gen.trim()) {
            user.gender = gen.trim()
            msg.gen = 'Gender Updated!'
        }
    }

    // Phone
    if (check(ph)) {
        if (ph.trim() === '') {
            if (user.phone) {
                user.phone = undefined
                msg.ph = 'Phone Number Removed'
            }
        } else if (user.phone !== ph.trim()) {
            user.phone = ph.trim()
            msg.ph = 'Phone Number Updated!'
        }
    }

    // Email ID
    let emchk = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if (check(oem) && check(nem) && check(cem)) {
        oem = oem.trim()
        nem = nem.trim()
        cem = cem.trim()
        if (oem === '') {
            msg.oem = 'Old Email ID is Required!'
        } else if (emchk.test(oem) && user.email === oem) {
            if (nem !== '' && cem !== '') {
                if (emchk.test(nem) && emchk.test(cem)) {
                    if (nem === cem) {
                        user.email = nem
                        msg.oem = 'Email ID Updated'
                    } else {
                        msg.nem = 'New Email and Confirm Email Match is Required!'
                        msg.cem = 'New Email and Confirm Email Match is Required!'
                    }
                } else {
                    msg.nem = 'Valid Email ID Required!'
                    msg.cem = 'Valid Email ID Required!'
                }
            }
        } else {
            msg.oem = 'Valid Email ID Required!'
        }
        if (nem === '') {
            msg.nem = 'New Email ID is Required!'
        } else if (!emchk.test(nem)) {
            msg.nem = 'Valid Email ID Required!'
        }
        if (cem === '') {
            msg.cem = 'Confirm Email ID is Required!'
        } else if (!emchk.test(nem)) {
            msg.cem = 'Valid Email ID Required!'
        }
    }

    // Password
    if (check(opw) && check(npw) && check(cpw)) {
        opw = opw.trim()
        npw = npw.trim()
        cpw = cpw.trim()
        if (opw === '') {
            msg.opw = 'Old Password is Required!'
        } else if (user.password === opw) {
            if (npw !== '' && cpw !== '') {
                if (npw >= 6 && cpw >= 6) {
                    if (npw === cpw) {
                        user.password = npw
                        msg.opw = 'Password Updated'
                    } else {
                        msg.npw = 'New Password and Confirm Password Match is Required!'
                        msg.cpw = 'New Password and Confirm Password Match is Required!'
                    }
                } else {
                    msg.npw = 'Password must be atleast 6 Characters'
                    msg.cpw = 'Password must be atleast 6 Characters'
                }
            }
        } else {
            msg.opw = 'Invalid Old Password!'
        }
        if (npw === '') {
            msg.npw = 'New Password is Required!'
        } else if (npw < 6) {
            msg.npw = 'Password must be atleast 6 Characters'
        }
        if (cpw === '') {
            msg.cpw = 'Confirm Password is Required!'
        } else if (cpw < 6) {
            msg.cpw = 'Password must be atleast 6 Characters'
        }
    }
    
    // Profile Pic
    if (req.file) {
        const data1 = await sharp(req.file.path).resize(50, 50).toBuffer()
        user.minimage.contentType = req.file.mimetype
        user.minimage.data = data1
        const data2 = await sharp(req.file.path).resize(200, 200).toBuffer()
        user.image.contentType = req.file.mimetype
        user.image.data = data2
        fs.unlinkSync(req.file.path)
        msg.suc = 'Profile Picture Updated!'
    }

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        msg.err = 'Nothing to Update'
    }

    await user.save()
    return res.json(msg)

    
})

router.post('/cover', upload.single('cpc'), async (req, res) => {
    
    let user = await Profile.findById(req.uid)
    let msg = {}
    
    // Cover Pic
    if (req.file) {
        const data = await sharp(req.file.path).resize(1300, 400).toBuffer()
        user.coverpic.contentType = req.file.mimetype
        user.coverpic.data = data
        fs.unlinkSync(req.file.path)
        msg.suc = 'Cover Picture Updated!'
    }

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        msg.err = 'Nothing to Update'
    }

    await user.save()
    return res.json(msg)

    
})

module.exports = router