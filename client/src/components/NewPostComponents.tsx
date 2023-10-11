import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../axios/axiosInstance";
import {
    NewPostItem,
    NewPostItemType,
    NewPostPageContentProps,
    NewPostPageItemProps,
    NewPostPageButtonsProps
} from "../tsobjects/newposts-objects";
import { Post } from '../tsobjects/post-objects';
import ValidateImage from "../classes/ImageValidator";

//#region BUILDPOST OBJECT
interface IBuildPost {
    post: Post | null
}

const BuildPost: React.FC<IBuildPost> = ({ post }: IBuildPost) => {
    //#region FIELDS
    const [title, setTitle] = useState<string>("UNTITLED");
    const [blogpostItems, setBlogpostItems] = useState<NewPostItem[]>([]);
    const [textboxCounter, addTextboxCounter] = useState<number>(0);
    const [imageCounter, addImageCounter] = useState<number>(0);
    const [submittingPost, setSubmittingPost] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);

    //Error states
    const [showTitleError, setShowTitleError] = useState<boolean>(false);
    const [serverError, setServerError] = useState<null | string>(null);

    //Other variables
    const _CanUpdate = () => !isAnimating && !submittingPost;
    const _CanSubmit = () => _CanUpdate() && blogpostItems.length > 0;
    const _AnimateTime = 500;
    const _CHAR_LIMIT = 2500;
    const navigate = useNavigate();
    //#endregion

    //#region START
    useEffect(() => {        
        //Check if Post is null
        if (post === null) return;
        
        //Load the title
        setTitle(post.title);

        //Sort posts
        const { sections } = post;
        const initialPosts = [] as NewPostItem[];
        var localTextboxCounter = textboxCounter;
        var localImageCounter = imageCounter;

        for (let x = 0; x < sections.length; x++){
            const sect = sections[x];
            if (sect.type === 0){
                //Add text item
                const newItem = {
                    name: `textbox${localTextboxCounter}`,
                    itemType: NewPostItemType.Text,
                    value: sect.text,
                    imgFile: null,
                } as NewPostItem;
                localTextboxCounter += 1;
                initialPosts.push(newItem);
            }
            else {
                //Add loaded image item
                const newItem = {
                    name: `image${localImageCounter}`,
                    itemType: NewPostItemType.LoadedImage,
                    value: '',
                    imgFile: null,
                    loadedImage: {
                        imgName: sect.imgName,
                        imgData: sect.imgData,
                        imgIndex: sect.imgIndex
                    }
                } as NewPostItem;
                localImageCounter += 1;
                initialPosts.push(newItem);
            }
        }

        addTextboxCounter(localTextboxCounter);
        addImageCounter(localImageCounter);
        setBlogpostItems(initialPosts);
    }, []);    
    //#endregion

    //#region ADDING METHODS
    const AddTextItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!_CanUpdate()) return;
        e.preventDefault();

        //Build
        const newItem = {
            name: `textbox${textboxCounter}`,
            itemType: NewPostItemType.Text,
            value: '',
            imgFile: null,
        } as NewPostItem;

        //Finished
        setBlogpostItems((blogpostItems) => [...blogpostItems, newItem]);
        addTextboxCounter((textboxCounter) => textboxCounter + 1);
    }

    const AddImageItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!_CanUpdate()) return;
        e.preventDefault();

        //Build
        const newItem = {
            name: `image${imageCounter}`,
            itemType: NewPostItemType.Image,
            value: '',
            imgFile: null,
        } as NewPostItem;

        //Finished
        setBlogpostItems((blogpostItems) => [...blogpostItems, newItem]);
        addImageCounter((imageCounter) => imageCounter + 1);
    }
    //#endregion

    //#region UPDATING METHODS
    const UpdateTitle = (e:React.ChangeEvent<HTMLInputElement>) => {
        if (!_CanUpdate()) return;
        setTitle(e.target.value as string);
    }

    const UpdateText = (index: string, value: string) => {
        if (!_CanUpdate()) return;
        const newBlogArray: NewPostItem[] = (blogpostItems.map(item => {
            if (item.name !== index){
                return item;
            }
            return {
                ...item, value: value
            }
        }));
        setBlogpostItems(newBlogArray);
    }

    const UpdateImage = async (index: string, file: File) => {
        if (!_CanUpdate()) return;

        const newArray: NewPostItem[] = (blogpostItems.map(item => {
            if (item.name !== index){
                return item;
            }

            //Set new file and replace possible old loadedImage
            return { ...item, itemType: NewPostItemType.Image, loadedImage: null, imgFile: file }
        }));

        setBlogpostItems(newArray);
    }
    //#endregion

    //#region MOVING METHODS
    const MoveItemUp = (index : number) => {
        _RepositionItem(index, true);
    }

    const MoveItemDown = (index: number) => {
        _RepositionItem(index, false);
    }

    const _RepositionItem = (index: number, moveUp: boolean) => {
        if (!_CanUpdate) return;
        if ((moveUp && index === 0) || (!moveUp && index === blogpostItems.length - 1)) return;
        setIsAnimating(true);

        //Set element references
        const replacedIndex = (moveUp) ? index - 1 : index + 1;
        const movedElement = document.getElementById(blogpostItems[index].name + "-div");
        const replacedElement = document.getElementById(blogpostItems[replacedIndex].name  + "-div");
        const movedElBounds = movedElement!.getBoundingClientRect();
        const replacedElBounds = replacedElement!.getBoundingClientRect();

        //We use Array.Map to create a deep-copy
        let newArray: NewPostItem[] = (blogpostItems.map(item => { 
            return item;
        }));

        //Switch
        newArray.splice(replacedIndex, 0, newArray.splice(index, 1)[0]);
        setBlogpostItems(newArray);

        //Animate
        if (moveUp){
            replacedElement!.style.transform = `translateY(-${movedElBounds.height}px)`;
            movedElement!.style.transform = `translateY(${replacedElBounds.height}px)`;
        }
        else {
            replacedElement!.style.transform = `translateY(${movedElBounds.height}px)`;
            movedElement!.style.transform = `translateY(-${replacedElBounds.height}px)`;
        }

        replacedElement!.animate([
            { transform: `translateY(0px)` }],
            { duration: _AnimateTime}
        );

        movedElement!.animate([
            { transform: `translateY(0px)` }],
            { duration: _AnimateTime}
        );

        setTimeout(() => {
            replacedElement!.style.transform = "translateY(0)";
            movedElement!.style.transform = "translateY(0)";
            setIsAnimating(false);
        }, _AnimateTime);
    }
    //#endregion

    //#region OTHER METHODS
    const _GetValue = (item: NewPostItem): any => {
        if (item.itemType === NewPostItemType.Text)
            return item.value;

        if (item.itemType === NewPostItemType.LoadedImage)
            return item.loadedImage!.imgIndex;

        return item.imgFile;
    }

    const OnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmittingPost(true);
        if (!window.confirm("Are you sure you want to submit post?")){
            setSubmittingPost(false);
            return;
        }

        //CHECK FOR ERRORS
        if (!_ValidatePost()){
            setSubmittingPost(false);
            return;
        }

        //CHECK IF NEW OR EDIT POST
        const isEdit = post !== null;

        //TRY - CREATE / EDIT POST
        try {
            const blogpost = new FormData();
            const structure:any[] = [];
            if (isEdit){
                blogpost.append("id", post.id);
            }
            blogpost.append("title", title);

            //Set each item (name) with its value
            //The value will either be text, id of reused image (if editing),
            //or a File sent via express-fileupload
            blogpostItems.forEach(item => {
                const value = _GetValue(item);
                blogpost.append(
                    item.name,
                    value
                );

                //Set the structure blueprint
                structure.push({
                    name: item.name,
                    type: (item.itemType === NewPostItemType.Text) ? 0 :
                    (item.itemType === NewPostItemType.LoadedImage) ? 2 : 1
                });
            });
            blogpost.append("structure", JSON.stringify(structure));

            //NewPost request
            if (!isEdit){
                const reponse =
                await axiosInstance.post("/api/new_post/", blogpost, { withCredentials: true });       

                if (reponse.data.status === "Succeeded"){
                    return navigate("/success", {
                        state: {
                            id: reponse.data.id,
                            type: "new"
                        }
                    });
                }
                else {
                    setServerError(reponse.data.error);
                    setSubmittingPost(false);
                }

                return;
            }

            //EditPost request
            const reponse = await axiosInstance.put("/api/new_post/", blogpost);
            if (reponse.data.status === "Succeeded"){
                return navigate("/success", {
                    state: {
                        id: reponse.data.id,
                        type: "edit"
                    }
                });
            }
            else {
                setServerError(reponse.data.error);
                setSubmittingPost(false);
            }
        }
        catch (e){
            const _message = (axios.isAxiosError(e)) ? e.message as string : "Unknown error";
            setServerError(_message);
            setSubmittingPost(false);
        }
    }

    const DeleteItem = (name: string) => {
        if (!_CanUpdate()) return;

        const target = blogpostItems.find(item => item.name === name);
        const toDeleteElement = document.getElementById(target!.name + "-div");
        toDeleteElement!.animate([
            { opacity: `0` }],
            { duration: _AnimateTime}
        );

        setTimeout(() => {
            setBlogpostItems(blogpostItems.filter(item => { return item.name !== name; }));
            setIsAnimating(false);
        }, _AnimateTime);
    }

    const _ValidatePost = (): boolean => {
        let postValidated = true;

        //VALIDATE TITLE
        if (title === ""){
            setShowTitleError(true);
            postValidated = false;
        }
        else {
            setShowTitleError(false);
        }

        //We use Array.Map to create a deep-copy
        let newArray: NewPostItem[] = (blogpostItems.map(item => { 
            return item;
        }));
        
        newArray.forEach(post => {
            //===TEXTBOXES===
            if (post.itemType === NewPostItemType.Text){
                if (post.value === ""){
                    post.error = "Textbox is empty.";
                    postValidated = false;
                }
                else if (post.value.length > _CHAR_LIMIT){
                    post.error = `Text can't exceed ${ _CHAR_LIMIT } characters.`;
                    postValidated = false;
                }
                else {
                    post.error = null;
                }
            }

            //===IMAGES===//
            if (post.itemType === NewPostItemType.Image){
                const result = ValidateImage(post.imgFile);
                if (result !== ""){
                    post.error = result;
                    postValidated = false;
                }
                else {
                    post.error = null;
                }
            }
        });

        //UPDATE ITEMS AND RETURN RESULT
        setBlogpostItems(newArray);
        return postValidated;
    }
    //#endregion

    //#region RENDER
    return(<div className='panel'>
        <form id="new-post-form" name="new-post-form" encType="multipart/form-data" onSubmit={OnSubmit}>
            {/*The Title Section*/}
            <section id="title-section">
                <input
                    type="text"
                    id= "title-input"
                    name= "title-input"
                    value={ title }
                    onChange = { UpdateTitle }
                    placeholder= "Please add title"
                />

                { showTitleError && <div className="error">Please Add a Title</div> }
            </section>

            {/*Empty Post Message*/}
            {blogpostItems.length === 0 && <div className="empty-message">
                To begin a new blogpost, click on the Add Text button or Add Image button.            
            </div>}

            {/*Server Error*/}
            {serverError && <div className="error"> Sorry, there was an error: { serverError } </div> }

            {/*The Content Section*/}
            <NewPostPageContent props = {{
                items: blogpostItems as NewPostItem[],
                onUpdateText: UpdateText,
                onUpdateImage: UpdateImage,
                onMoveUp: MoveItemUp,
                onMoveDown: MoveItemDown,
                onDelete: DeleteItem
                }}
            />

            {/*The Build Buttons Section*/}
            <NewPostPageButtons props={ { onAddText: AddTextItem, onAddImage: AddImageItem } } />

            {/*The Submit Btton*/}
            <section id="submit-post-section">
                <button type="submit" id="submit-button" disabled={ !_CanSubmit() }>
                    SUBMIT POST
                </button>
            </section>
        </form>
        { submittingPost && <ValidatingMessage /> }
    </div>);
    //#endregion
}
//#endregion

//#region NEW POST PAGE BUTTONS
interface INewPostPageButtons {
    props: NewPostPageButtonsProps
}

const NewPostPageButtons: React.FC<INewPostPageButtons> = ({ props }: INewPostPageButtons) => {
    return (<section id="buttons-section">
        <button type="button" className="add-item-btn" onClick={ props.onAddText } >
            ADD TEXT
        </button>

        <button type="button" className="add-item-btn" onClick={ props.onAddImage } >
            ADD IMAGE
        </button>
    </section>);
}
//#endregion

//#region NEW POST PAGE CONTENT
interface INewPostPageContent {
    props: NewPostPageContentProps
}

const NewPostPageContent: React.FC<INewPostPageContent> = ({ props }) => {
    const blogpostItems = props.items.map((item, index) => {
        return <NewPostPageItem props={{ data: props, item: item, key: index }} key = { item.name } />
    });
    
    return (<section id='content-section'>
        { blogpostItems }
    </section>);
}
//#endregion

//#region NEW POST PAGE ITEM
interface INewPostPageItem {
    props: NewPostPageItemProps
}

const NewPostPageItem: React.FC<INewPostPageItem> = ({ props }) => {
    const { item } = props;
 
    if (item.itemType === NewPostItemType.Text) {
        return <_TextItem props= { props } />
    }

    return <_ImageItem props= { props } />
}

//TEXTBOX
const _TextItem: React.FC<INewPostPageItem> = ({ props }) => {
    const CHAR_LIMIT = 2500;
    const {item } = props;
    const REMAINING_CHARS = CHAR_LIMIT - item.value.length;
    const CHAR_COUNTER_NAME = (REMAINING_CHARS < 0) ? "char-counter char-counter-error" : "char-counter";

    const _onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        const _value = e.target.value as string;
        const _index = item.name as string;
        props.data.onUpdateText(_index, _value);
    }

    return (<div className='text-item' id={ `${item.name}-div`} >
        { item.error && <div className='error'> { item.error } </div> }
        <h5>Name: { item.name }</h5>
        <p>Please add your text in this box.</p>
        <textarea
            id={ item.name }
            name={ item.name }
            value={ item.value }
            onChange = { _onChange }
            wrap= "soft"
            placeholder= "Please insert text here..."
        />
        <span className= { CHAR_COUNTER_NAME }> Characters left: { REMAINING_CHARS } / { CHAR_LIMIT }. </span>
        <NewPostPageItemButtons props= { props } />
    </div>)
}

//IMAGE
const _ImageItem: React.FC<INewPostPageItem> = ({ props }) => {
    const { item } = props;

    const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        const selectedFiles = files as FileList;
        if (selectedFiles.length === 0)
            return;
        const _value = selectedFiles[0];
        const _index = item.name as string;
        props.data.onUpdateImage(_index, _value);
    }

    return (<div className='image-item' id={ `${item.name}-div`}>
        { item.error && <div className='error'> { item.error } </div> }
        <h5>Name: { item.name }</h5>
        { item.imgFile === null && item.loadedImage === null &&
            <p>Please insert you image.</p>
        }
        
        <input
            type="file"
            id={item.name}
            name={item.name}
            accept=".jpg, .jpeg, .png, .gif"
            onChange = { _onChange }
        />

        {/*IMAGE TYPE ONE: LOCALLY LOADED*/}
        { item.imgFile && <div className="preview-image">
            <img
                alt={ `Preview of ${item.imgFile.name}`}
                title = { item.imgFile.name }
                src= { URL.createObjectURL(item.imgFile)}        
            />
        </div> }

        {/*IMAGE TYPE TWO: LOADED FROM DB*/}
        { item.loadedImage && <div className="preview-image">
            <img
                src = { item.loadedImage.imgData }
                alt = { item.loadedImage.imgName }
                title= { item.loadedImage.imgName }
            />           
        </div> }
        
        <div className="image-object-file">
            <label htmlFor={ item.name }>Click to Upload</label>
            <div>FILE: {item.imgFile?.name || 'No File Uploaded' }</div>
        </div>
        <NewPostPageItemButtons props= { props } />
    </div>)
}

//ITEM BUTTONS
const NewPostPageItemButtons: React.FC<INewPostPageItem> = ({ props }) => {
    return (<>
        <button type="button"
            className="delete-object-button"
            onClick={() => props.data.onDelete(props.item.name)}
        >
            &times;
        </button>
        <div className="edit-buttons-wrapper">
            <button type="button" onClick={ () => props.data.onMoveUp(props.key) }>
                MOVE UP
            </button>
            <button type="button" onClick={ () => props.data.onMoveDown(props.key) }>
                MOVE DOWN
            </button>
        </div>
    </>);
}
//#endregion

//#region VALIDATING MESSAGE
const ValidatingMessage: React.FC = () => {
    return (<div className='validation-message'>
        <div className='validation-message-text'>Submitting Post! Please wait a moment...</div>
    </div>);
}
//#endregion

//EXPORTS
export { BuildPost };