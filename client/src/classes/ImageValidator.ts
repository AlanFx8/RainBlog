const _FileExts = /\.(gif|jpe?g|png)$/i;
const _LegalName =/^[^\\/:\*\?"<>\|]+$/;
const _MaxSize = 16000000;
const _MaxSizeMB = "16MBs";

const ValidateImage = (_File: File | null): string => {
    //Null check
    if (_File === null){
        return "Please add an image";
    }

    //Check File is an image
    if (!_FileExts.test(_File.name)){
        return "Please upload an acceptable image type: jpg, png, or gif.";
    }

    //Check File is too large
    if (_File.size > _MaxSize){
        return `Sorry, but images can't exceed ${_MaxSizeMB}`;
    }

    //Check for an illegal filename
    if (!_LegalName.test(_File.name)){
        return "Sorry, but this image has an illegal file name, plase change it.";
    }

    //Return empty string (success)
    return "";
}

export default ValidateImage;