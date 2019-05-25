const express = require('express')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const router = express.Router();


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
        let oem, nem, cem, opw, npw, cpw = undefined
        if (res.locals.fn.length) {
            oem = res.locals.fn[0]
        }
        if (res.locals.ln.length) {
            nem = res.locals.ln[0]
        }
        if (res.locals.em.length) {
            cem = res.locals.em[0]
        }
        if (res.locals.reg.length) {
            opw = res.locals.reg[0]
        }
        if (res.locals.sucmsg.length) {
            npw = res.locals.sucmsg[0]
        }
        if (res.locals.errmsg.length) {
            cpw = res.locals.errmsg[0]
        }
        
        res.render('sett3', { data, oem, nem, cem, opw, npw, cpw })
    }).catch((err) => {
        console.log(err)
    })
})

router.post('/', (req, res) => {
    const { oem, nem, cem, opw, npw, cpw, btn } = req.body
    console.log(req.body)
    if (btn === 'email') {
        const p = new URLSearchParams()
        p.append('oem', oem)
        p.append('nem', nem)
        p.append('cem', cem)
        fetch(res.locals.uri + 'setinfo', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + req.session.token
            },
            body: p
        }).then(res => res.json()).then(data => {
            if (data.msg) {
                return res.redirect('/')
            }
            if (data.oem) {
                req.flash('fn', data.oem)
            }
            if (data.nem) {
                req.flash('ln', data.nem)
            }
            if (data.cem) {
                req.flash('em', data.cem)
            }
            res.redirect('/Account-Settings')
        }).catch((err) => {
            console.log(err)
        })
    } else if (btn === 'pass') {
        const p = new URLSearchParams()
        p.append('opw', opw)
        p.append('npw', npw)
        p.append('cpw', cpw)
        console.log(p)
        fetch(res.locals.uri + 'setinfo', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + req.session.token
            },
            body: p
        }).then(res => res.json()).then(data => {
            if (data.msg) {
                return res.redirect('/')
            }
            if (data.opw) {
                req.flash('reg', data.opw)
            }
            if (data.npw) {
                req.flash('suc', data.npw)
            }
            if (data.cpw) {
                req.flash('err', data.cpw)
            }
            res.redirect('/Account-Settings')
        }).catch((err) => {
            console.log(err)
        })
    }
    
    
    

     
})

module.exports = router