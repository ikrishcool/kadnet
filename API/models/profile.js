const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    email: { type: String, lowercase: true },
    userName: { type: String, lowercase: true },
    password: String,
    firstName: String,
    lastName: String,
    location: String,
    gender: String,
    phone: String,
    image: { data: Buffer, contentType: String },
    minimage: { data: Buffer, contentType: String },
    dob: Date,
    online: Boolean,
    friends: {
        sent: [String],
        received: [String],
        accepted: [String]
    },
    createdAt: Date,
    updatedAt: { type: Date, default: Date.now }    
}, {
    versionKey: false
})

const Profile = mongoose.model('Profile', ProfileSchema)
module.exports = Profile
