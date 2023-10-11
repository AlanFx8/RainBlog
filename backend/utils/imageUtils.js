const GetThumbnailSize = async (img) => {
    const max_res = 200;

    let ratio = max_res / img.width;
    let newWidth = max_res;
    let newHeight = img.height * ratio;

    if (newHeight > max_res){
        ratio = max_res / img.height;
        newHeight = max_res;
        newWidth = img.width * ratio;
    }

    return { width: parseInt(newWidth), height: parseInt(newHeight) }
}

//EXPORTS
module.exports = { GetThumbnailSize };