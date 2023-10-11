const express = require("express");
const asyncHandler = require("express-async-handler");
const BlogpostModel = require("../models/BlogpostModel");
const FullImageSetModel = require("../models/FullImageSetModel");

//Create router
const router = express.Router();

//#region ROUTES
//Get list of all Blogposts
router.get("/list", asyncHandler(async (req, res) => {
    const response = await BlogpostModel.find({}, { title: 1, createdAt: 1});
    res.status(200).json(response);
}));

//Get by ID
router.get("/:id", asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await BlogpostModel.findById({ _id: id });

    //404 check
    if (!result){
        res.status(404);
        throw new Error(`Post '${id}' Not Found`);
    }

    //Post found - build fixed post
    const blogpost = await _buildFixedPost(result);
    res.status(200).json(blogpost);
}));

//Get 1 post at a time - start with page 1
router.get("/page/:index", asyncHandler(async (req, res) => {
    const index = req.params.index;
    const skipAmount = index - 1;
    if (skipAmount < 0) skipAmount = 0;

    const results = await BlogpostModel.find().skip(skipAmount).limit(1);

    if (!results){
        res.status(404);
        throw new Error(`Post Not Found. No more posts?`);
    }

    const blogpost = await _buildFixedPost(results[0]);
    const count = await BlogpostModel.countDocuments({});
    blogpost.isLastPost = skipAmount === (count - 1) ? true : false;
    res.status(200).json(blogpost);
}));

//Get FullImage sets
//Get by ID
router.get("/images/:id", asyncHandler(async (req, res) => {
    const id = req.params.id;
    const result = await FullImageSetModel.findById({ _id: id });

    //404 check
    if (!result){
        res.status(404);
        throw new Error(`Image set of ${ id } Not Found.`);
    }

    //Post found - build fixed post
    const sections = [];
    for (let x = 0; x < result.sections.length; x++){
        const item = result.sections[x];
        const fullPath = await _getBase64String(item);
        sections.push({
            type: 1,
            imgName: item.imgName,
            imgData: fullPath,
            imgIndex: item.imgIndex,
        });
    }

    //Return object
    res.status(200).json(sections);
}));
//#endregion

//#region PRIVATE METHODS
const _buildFixedPost = async post => {
    const newPost = {}; //Build return post

    //Add main fields
    newPost.title = post.title;
    newPost.id = post._id;
    newPost.datePosted = post.createdAt;
    newPost.lastUpdated = post.updatedAt;
    newPost.fullImageSetId = post.fullImageSetId;

    //Add sections
    const _sections = [];

    for (let x = 0; x < post.sections.length; x++){
        const item = post.sections[x];

        if (item.type === 0){ //ADD TEXT OBJECT
            _sections.push({
                type: 0,
                text: item.text
            });
        }
        else { //ADD IMAGE OBJECT
            const fullPath = await _getBase64String(item);

            _sections.push({
                type: 1,
                imgName: item.imgName,
                imgData: fullPath,
                imgIndex: item.imgIndex,
            });
        }
    }

    //Done
    newPost.sections = _sections;
    return newPost;
}

/*
Returns a base64 string from a buffer
Takes an 'item' as an argument and assumes it has an
imgName and imgData property
*/
const _getBase64String = async item => {
    const buff = Buffer.from(item.imgData, 'utf-8');
    const base64data = buff.toString('base64');
    const words = item.imgName.split('.');
    const mime = words[words.length-1];
    return fullPath = `data:image/${mime};base64,` + base64data;
}
//#endregion

//EXPORT
module.exports = router;