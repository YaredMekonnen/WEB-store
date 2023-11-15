const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Editor: Number,
        Admin: Number
    },
    desc: {
        type: String,
        required: true
    },
    image: {
        type: Buffer,
        required: true
         
    },
    refreshToken: [String]
});

module.exports = mongoose.model('Post', postSchema);
//