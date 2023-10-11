import { Post, ImageModelPostAsset, ImageSection } from "../tsobjects/post-objects";

///THE IMAGE MODEL DATA SET CLASS///
export default class ImageModelDataSet {
    //#region FIELDS
    private _ImageModelSets: {[index: string]: ImageModelPostAsset} = {}
    //#endregion

    //#region PUBLIC METHODS
    public AddImageSet = (post: Post): void => {
        if (this._ImageModelSets[post.id])
            return;
        
        const _images = this._GetImagesFromPost(post);
        if (_images === null)
            return;
        
        this._ImageModelSets[post.id] = {
            fullImageSetId: post.fullImageSetId,
            images: _images,
            isFullImageSet: false
        } as ImageModelPostAsset;
    }

    public AddFullImageSet = (id: string, images: ImageSection[]) => {
        if (!this._ImageModelSets[id] || this._ImageModelSets[id].isFullImageSet)
        return;
        this._ImageModelSets[id].images = images;
        this._ImageModelSets[id].isFullImageSet = true;
    }

    //Client-side will check if it got an actual array or not
    public GetImagePostAsset = (id : string): ImageModelPostAsset => {
        return this._ImageModelSets[id];
    }
    //#endregion

    //#region PRIVATE METHODS
    private _GetImagesFromPost = (post: Post): ImageSection[] | null => {
        const _Images: ImageSection[] = [] as ImageSection[];

        for (let x = 0; x < post.sections.length; x++){
            const section = post.sections[x];
            if (section.type === 1){
                _Images.push({
                    imgData: section.imgData!,
                    imgName: section.imgName!,
                    imgSize: section.imgSize!,
                    imgIndex: section.imgIndex!
                })
            }
        }

        if (_Images.length === 0)
            return null;

        return _Images;
    }
    //#endregion
}