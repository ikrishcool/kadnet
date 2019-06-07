
const getSID = async (str) => {
    const sid = str.split(';')
    for (i = 0; i < sid.length; i++) {
        tmp = sid[i]
        if (tmp.includes('connect')) {
            start = tmp.indexOf('=')
            s = tmp.substring(start + 1)
            return s
        }
    }
}

const isActive = async (req, id) => {
    for (i = 0; i < req.app.users.length; i++) {
        user = req.app.users[i]
        if (user.uid === id) {
            return user
        }
    }
    return false
}

const emitter = async (req, uid, name, code) => {
    const io = req.app.io
    const sockets = io.sockets.sockets
    const active = await isActive(req, uid)
    for (id in sockets) {
        const s = sockets[id]
        const ssid = await getSID(s.handshake.headers.cookie)
        const sid = s.id
        if (active) {
            if (active.sid === ssid) {
                io.to(sid).emit(name, code)
            }
        }
    }
}

module.exports = emitter