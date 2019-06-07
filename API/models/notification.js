const mongoose = require('mongoose')

const NotiSchema = new mongoose.Schema({
    
    createdAt: { type: Date, default: Date.now }    
}, {
    versionKey: false
})

const Notification = mongoose.model('Notification', NotiSchema)
module.exports = Post
