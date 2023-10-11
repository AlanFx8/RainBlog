type PostSection = {
    type: number,
    text?: string,
    imgName?: string,
    imgSize?: number,
    imgData?: string,
    imgIndex?: number,
}

type Post = {
    id: string,
    title: string,
    datePosted: string,
    lastUpdated: string,
    sections: PostSection[],
    fullImageSetId: string
}

//PostSectionSets represents wrapped groups of images
//or textboxes in a processed post
type PostSectionSet = {
    type: number,
    items: PostSection[]
}

//ImageSection represents only data for images
//Mainly used for the Image Model
type ImageSection = {
    imgName: string,
    imgSize: number,
    imgData: string,
    imgIndex: number
}

/*
fullImageId: when a IMPA is clicked the first time,
this reference is grabbed to start loading the full image set
images: the actual image sections to show
isFullImageSet: are the images thumbnail images or the full sized image
*/
type ImageModelPostAsset = {
    fullImageSetId: string,
    images: ImageSection[],
    isFullImageSet: boolean
}

//ModalImageRect represents the size and offset of an image in the ImageModal
//It's easier to do it by code than by flexbox or grid
type ModalImageRect = {
    left: number,
    top: number,
    width: number,
    height: number
}

//Export
export {
    type Post, type PostSection,
    type PostSectionSet, type ImageSection,
    type ImageModelPostAsset, type ModalImageRect
}