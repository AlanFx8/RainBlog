const express = require("express");
const asyncHandler = require("express-async-handler");
const Blogpost = require("../models/BlogpostModel");
const FullImageSet = require("../models/FullImageSetModel");
const router = express.Router();
const sizeOf = require('image-size');
const sharp = require('sharp');
const { GetThumbnailSize } = require('../utils/imageUtils');

//#region POST ROUTES
router.post("/", asyncHandler(async (req, res) => {
    res.status(200).send(_GenerateSuccessObject("NA"));
}));

//WORKING - ONLY FOR LOCAL USE
/*
router.post("/", asyncHandler(async (req, res) => {
    const post = await _GeneratePost(req, false, null, null);

    //Set up new Blogpost
    const newPost = new Blogpost;
    newPost.title = post.title;
    newPost.sections = post.sections;

    //Set up new FullImageSet
    const newFullImageSet = new FullImageSet;
    newFullImageSet.sections = post.fullImageSections;
    
    try {
        if (newFullImageSet.sections.length > 0){
            const fullImageSetResult = await newFullImageSet.save();
            newPost.fullImageSetId = fullImageSetResult._id.toString();
        }
        else {
            newPost.fullImageSetId = "NA";
        }

        const result = await newPost.save();
        res.status(200).send(_GenerateSuccessObject(result._id));
    }
    catch (e) {
        res.status(500).json(_GenerateErrorObject(e.message));
    }
}));
*/
//#endregion

//#region PUT ROUTES
router.put("/", asyncHandler(async (req, res) => {
    res.status(200).send(_GenerateSuccessObject(req.body.id));
}));

//WORKING - ONLY FOR LOCAL USE
/*
router.put("/", asyncHandler(async (req, res) => {
    const oriPost = await Blogpost.findById({ _id: req.body.id });
    
    const oriImageSet = (oriPost.fullImageSetId !== "NA") ?
        await FullImageSet.findById({ _id: oriPost.fullImageSetId }) : null;
    
    const post = await _GeneratePost(req, true, oriPost, oriImageSet);

    //Update the post
    try {
        if (oriImageSet){
            await oriImageSet.updateOne({
                sections: post.fullImageSections
            });
        }

        await oriPost.updateOne({
            title: post.title,
            sections: post.sections
        });
        
        res.status(200).send(_GenerateSuccessObject(req.body.id));
    }
    catch (e) {
        res.status(500).json(_GenerateErrorObject(e.message));
    }
}));
*/
//#endregion

//#region METHODS
const _GeneratePost = async (req, isEdit, oriPost, oriImageSet) => {
    //Set Types
    const TEXT = 0;
    const IMAGE = 1;
    const SAVED_IMAGE = 2;

    //Set Image Index
    let image_index_counter = 0;

    //Grab body (textposts and saved images) and files (images)
    const { body, files } = req;

    //Grab structure and title
    const structure = JSON.parse(req.body.structure);
    const title = req.body.title.toUpperCase();

    //Create PostSection array
    const sections = [];
    const fullImageSections = [];

    //Build post
    for (let x = 0; x < structure.length; x++){
        const current = structure[x];

        //Text
        if (current.type === TEXT){
            sections.push({
                type: TEXT,
                text: body[current.name]
            });
        }
        
        //Images
        if (current.type === IMAGE){
            const target = files[current.name];
            fullImageSections.push({
                type: IMAGE,
                imgName: target.name,
                imgSize: target.size,
                imgData: target.data,
                imgIndex: image_index_counter
            });

            //Store thumbnail-sized image
            const newSize =
                await GetThumbnailSize(sizeOf(target.data));
            const resizedImage =
                await sharp(target.data).resize(newSize.width, newSize.height).toBuffer();
            sections.push({
                type: IMAGE,
                imgName: target.name,
                imgSize: target.size,
                imgData:  resizedImage,
                imgIndex: image_index_counter
            });
            image_index_counter += 1;
        }

        //Saved Image
        if (isEdit && current.type === SAVED_IMAGE){
            const savedImage = parseInt(body[current.name]);
            for (let y = 0; y < oriPost.sections.length; y++){
                const sect = oriPost.sections[y];
                if (sect.type === IMAGE && sect.imgIndex === savedImage){
                    //Save Full Image
                    const fullImage = _GetFullImage(sect.imgIndex, oriImageSet);
                    if (fullImage){
                        fullImageSections.push({
                            type: IMAGE,
                            imgName: fullImage.imgName,
                            imgSize: fullImage.imgSize,
                            imgData: fullImage.imgData,
                            imgIndex: image_index_counter
                        });
                    }

                    //Save Thumbnail Image
                    sections.push({
                        type: IMAGE,
                        imgName: sect.imgName,
                        imgSize: sect.imgSize,
                        imgData: sect.imgData,
                        imgIndex: image_index_counter
                    });

                    //Increase image_index_counter
                    image_index_counter += 1;
                }
            }
        }
    }

    //Return built post
    return { title, sections, fullImageSections };
}
//#endregion

//#region HELPERS
const _GetFullImage = (index, fullImageSet) => {
    if (!fullImageSet) return null;
    for (let x = 0; x < fullImageSet.sections.length; x++){
        if (fullImageSet.sections[x].imgIndex === index){
            return fullImageSet.sections[x];
        }
    }
    return null;
}

const _GenerateSuccessObject = (_id) => {
    return {
        status: "Succeeded",
        succeeded: true,
        failed: false,
        id: _id
    };
}

const _GenerateErrorObject = (_msg) => {
    return {
        status: "Failed",
        succeeded: false,
        failed: true,
        message: _msg
    };
}
//#endregion

//EXPORT
module.exports = router;