const express = require('express')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const router = express.Router()

router.get('/', (req, res) => {
    if (req.session.token) {
        return res.redirect('newsfeed')
    }
    let err, suc, fn, ln, em, lem = undefined
    let reg = false
    if (res.locals.errmsg.length) {
        err = res.locals.errmsg
    }
    if (res.locals.sucmsg.length) {
        suc = res.locals.sucmsg
    }
    if (res.locals.fn.length) {
        fn = res.locals.fn[0]
    }
    if (res.locals.ln.length) {
        ln = res.locals.ln[0]
    }
    if (res.locals.em.length) {
        em = res.locals.em[0]
    }
    if (res.locals.reg.length) {
        reg = true
    } else {
        lem = em
        fn, ln, em = undefined
    }
    res.render('auth', { fn, ln, em, lem, reg, errmsg: err, sucmsg: suc })
})

router.post('/', (req, res) => {
    const { lem, lpw, fn, ln, em, pw } = req.body
    if (fn && ln && em && pw) {
        const p = new URLSearchParams()
        p.append('fn', fn)
        p.append('ln', ln)
        p.append('em', em)
        p.append('pw', pw)
        fetch(res.locals.uri + 'register', {
            method: 'POST',
            body: p
        }).then(res => res.json()).then(json => {
            if (json.suc) {
                req.flash('em', em)
                req.flash('suc', json.suc)
            } else if (json.msg.indexOf('Password') == 0) {
                req.flash('fn', fn)
                req.flash('ln', ln)
                req.flash('em', em)
                req.flash('reg', '1')
                req.flash('err', json.msg)
            } else if (json.msg.indexOf('Email') == 0) {
                req.flash('em', em)
                req.flash('err', json.msg)
            } else if (json.msg) {
                req.flash('reg', '1')
                req.flash('err', json.msg)
            }
            res.redirect('/')
        }).catch(() => {
            req.flash('err', "Internal Error 101")
            res.redirect('/')
        })
    } else if (lem && lpw) {
        const p = new URLSearchParams()
        p.append('em', lem)
        p.append('pw', lpw)
        fetch(res.locals.uri + 'login', {
            method: 'POST',
            body: p
        }).then(res => res.json()).then(json => {
            if (json.msg) {
                req.flash('em', lem)
                req.flash('err', json.msg)
                res.redirect('/')
            } else {
                req.session.token = json.token
                res.redirect('newsfeed')
            }
        }).catch(() => {
            req.flash('err', "Internal Error 102")
            res.redirect('/')
        })
    } else {
        res.redirect('/')
    }
})

module.exports = router