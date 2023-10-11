const mongoose = require('mongoose');

//A PostSection Model
const PostSection = mongoose.Schema({
    type: {
        type: Number,
        min: 0, //Text
        max: 1, //Images
        default: 0,
        required: [true, "Please defined Type"]
    },
    text: {
        type: String,
    },
    imgName: {
        type: String,
    },
    imgSize: {
        type: Number
    },
    imgData: {
        type: Buffer
    },
    imgIndex: {
        type: Number
    }
});

//Export
module.exports = PostSection;