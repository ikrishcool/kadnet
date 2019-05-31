const express = require('express')
const fetch = require('node-fetch')
const fd = require('form-data')
const multer = require('multer')
const fs = require('fs')
const router = express.Router();

const tmpstr = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: tmpstr })

router.get('/', (req, res) => {
    
    fetch(res.locals.uri + 'getinfo', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + req.session.token
        }
    }).then(res => res.json()).then(data => {
        if (data.msg) {
            return res.redirect('logout')
        }
        res.render('sett4', { data })
    }).catch((err) => {
        console.log(err)
    })
})

router.post('/', upload.single('pf'), (req, res) => {
    if (req.file) {
        const p = new fd()
        const rs = fs.createReadStream(req.file.path)
        p.append('cpc', rs)
        fetch(res.locals.uri + 'setinfo/cover', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + req.session.token
            },
            body: p
        }).then(res => res.json()).then(data => {
            if (data.msg) {
                return res.redirect('/')
            }
            res.send(data.suc)
            fs.unlinkSync(req.file.path)
        }).catch((err) => {
            console.log(err)
        })
    }
     
})


module.exports = router