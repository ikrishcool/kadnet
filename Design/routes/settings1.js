const express = require('express')
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')
const router = express.Router();


router.get('/', (req, res) => {
    const data = req.data
    const pending = req.pending
    let fn, ln, un, gen, loc, ph = undefined
    if (res.locals.fn.length) {
        fn = res.locals.fn[0]
    }
    if (res.locals.ln.length) {
        ln = res.locals.ln[0]
    }
    if (res.locals.em.length) {
        un = res.locals.em[0]
    }
    if (res.locals.reg.length) {
        gen = res.locals.reg[0]
    }
    if (res.locals.sucmsg.length) {
        loc = res.locals.sucmsg[0]
    }
    if (res.locals.errmsg.length) {
        ph = res.locals.errmsg[0]
    }
    
    res.render('sett1', { data, fn, ln, un, gen, loc, ph, pending })
})

router.post('/', (req, res) => {
    const { fn, ln, un, loc, gen, ph } = req.body
    const p = new URLSearchParams()
    p.append('fn', fn)
    p.append('ln', ln)
    p.append('un', un)
    p.append('loc', loc)
    p.append('gen', gen)
    p.append('ph', ph)
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
        if (data.fn) {
            req.flash('fn', data.fn)
        }
        if (data.ln) {
            req.flash('ln', data.ln)
        }
        if (data.un) {
            req.flash('em', data.un)
        }
        if (data.gen) {
            req.flash('reg', data.gen)
        }
        if (data.loc) {
            req.flash('suc', data.loc)
        }
        if (data.ph) {
            req.flash('err', data.ph)
        }
        res.redirect('/Personal-Settings')
    }).catch((err) => {
        console.log(err)
    })    
})

module.exports = router