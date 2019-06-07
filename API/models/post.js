const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    pown: String,
    firstName: String,
    lastName: String,
    minimage: { data: Buffer, contentType: String },
    text: String,
    image: { data: Buffer, contentType: String },
    likes: [String],
    comment: [{
        uid: String,
        message: String,
        time: { type: Date, default: Date.now }
    }],
    updatedAt: { type: Date, default: Date.now }    
}, {
    versionKey: false
})

/* PostSchema.pre('save', function(next) {
    this.updatedAt = Date.now()
    next()
}) */

const Post = mongoose.model('Post', PostSchema)
module.exports = Post
