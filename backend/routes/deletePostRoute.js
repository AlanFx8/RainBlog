const express = require("express");
const asyncHandler = require("express-async-handler");
const Blogpost = require("../models/BlogpostModel");
const FullImageSet = require("../models/FullImageSetModel");
const router = express.Router();

router.delete("/:id", asyncHandler(async (req, res) => {
    res.status(200).send({
        status: "Succeeded",
        succeeded: true,
        failed: false,
        id: req.params.id
    });
}));

//WORKING - ONLY FOR LOCAL USE
/*
router.delete("/:id", asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Blogpost.findById({ _id: id });   

        //Check if post is null
        if (post === null){
            res.status(400).json({
                status: 'Failed',
                succeeded: false,
                failed: true,
                message: 'Post not found'
            });
        }

        //Get fullImageSet if it exists
        const fullImageSet = (post.fullImageSetId !== "NA")  ?
            await FullImageSet.findById({ _id: post.fullImageSetId }) : null;

        //Delete posts
        if (fullImageSet){
            fullImageSet.deleteOne();
        }
        post.deleteOne();
        res.status(200).send({
            status: "Succeeded",
            succeeded: true,
            failed: false,
            id: post.id
        });
    }
    catch (error){
        res.json({
            status: 'Failed',
            succeeded: false,
            failed: true,
            message: error.message
        });
    }
}));
*/

//EXPORT
module.exports = router;