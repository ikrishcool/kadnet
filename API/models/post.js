const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    pown: String,
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

const Post = mongoose.model('Post', PostSchema)
module.exports = Post
