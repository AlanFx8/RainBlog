const mongoose = require("mongoose");
const PostSection = require("./submodels/PostSection");

//The Schema
const FullImageSetSchema = mongoose.Schema({
    sections: {
        type: [PostSection],
        required: [true, 'Please add at least one item.']
    }
});

//Export
module.exports = mongoose.model("FullImageSets", FullImageSetSchema);