import React from "react";

//#region NEW POSTS
enum NewPostItemType {
    Text = 0,
    Image = 1,
    LoadedImage = 2 //LoadImage == loaded from a saved post being edited
}

type NewPostItem = {
    name: string,
    itemType: NewPostItemType, //Is it text, a image, or saved image
    value: string, //For textboxes, left as a empty string for images
    imgFile: File | null, //For images, left as null for text boxes
    loadedImage: LoadedImage | null, //We can replace loadedImages with new imgFiles so it must be nullable
    error: string | null, //An object's error message
}

type LoadedImage = {
    imgData: string,
    imgName: string,
    imgIndex: number
}
//#endregion

//#region NEW POST PAGE CONTENTS
type NewPostPageContentProps = {
    items: NewPostItem[],
    onUpdateText: (index: string, value: string) => void,
    onUpdateImage: (index: string, value: File) => void,
    onMoveUp: (index: number) => void,
    onMoveDown: (index: number) => void,
    onDelete: (index: string) => void,
}

type NewPostPageItemProps = {
    data: NewPostPageContentProps, //We need all methods from the NewPostContentProps
    item: NewPostItem, //Passsed throught .map
    key: number //Refers to the index in the blogpost array, for moving and deleteing items
}
//#endregion

//#region NEW POST PAGE BUTTONS
type NewPostPageButtonsProps = {
    onAddText: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onAddImage: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
//#endregion

//EXPORT
export {
    NewPostItemType,
    type NewPostItem,
    type LoadedImage,
    type NewPostPageContentProps,
    type NewPostPageItemProps,
    type NewPostPageButtonsProps
}