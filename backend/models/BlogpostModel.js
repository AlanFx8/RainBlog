const mongoose = require("mongoose");
const PostSection = require("./submodels/PostSection");

//The Schema
const BlogpostSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for your post']
    },
    fullImageSetId: {
        type: String,
        required: [true, 'Please add an ID for the full image set']
    },
    sections: {
        type: [PostSection],
        required: [true, 'Please add at least one item.']
    }
}, { timestamps: true });

//Export
module.exports = mongoose.model("Blogposts", BlogpostSchema);