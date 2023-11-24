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
    images: {
        type: [String],
        required: true
    },
    views: {
        type: Number,
        default: 0,
    },
    email: { type: String, required: true},
    phone:{ type: Number, required: true},
    idnumber: { type: Number, required: true},
    refreshToken: [String]
});

module.exports = mongoose.model('Post', postSchema);


// userEmail: String,
// line_items:Object,
// name:String,
// email:String,
// city:String,
// postalCode:String,
// streetAddress:String,
// country:String,
// paid:Boolean,