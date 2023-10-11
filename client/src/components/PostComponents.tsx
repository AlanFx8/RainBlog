import React, { useState, useEffect, ForwardedRef, SyntheticEvent } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import { useAppSelector } from "../hooks";
import ImageModelDataSet from "../classes/ImageModelDataSet";
import ScrollController from '../classes/ScrollController';
import PostModal from "./PostModal";
import ErrorMessage from './ErrorMessage';
import { Post, PostSection, PostSectionSet, ImageSection } from './../tsobjects/post-objects';
import '../styles/post.scss';

//#region  INTERFACES
interface IPostPageContent {
    posts: Post[] | null,
    lastPostRef: ((post: HTMLDivElement) => void) | null,
    status: string, //LOADING, ERROR, etc.
    showLink: boolean, //Yes for AllPosts, no for GetPosts
    error: any
}

interface IPostContent {
    post: Post,
    onClick: (id: string, index: number) => void,
    showLink: boolean,
    showAdminPanel: boolean
}

interface IPostSection {
    item: PostSection,
    id: string,
    onClick: (id: string, index: number) => void
}

interface ISetBuilder {
    items: PostSection[],
    id: string,
    onClick: (id: string, index: number) => void
}
//#endregion

//#region POSTPAGECONTENT
const _ImageModelData = new ImageModelDataSet;
const _ScrollController = new ScrollController;

const PostPageContent: React.FC<IPostPageContent> = 
({ posts, lastPostRef, status, showLink, error }: IPostPageContent) => {
    //#region FIELDS
    const _GetEmptyImageSet = (): ImageSection[] => {
        return [ { imgName: "", imgData: "", imgSize: 0, imgIndex: 0 }];
    }
    const { userInfo } = useAppSelector((state) => state.auth);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [imageSet, applyImageSet] = useState<ImageSection[]>(_GetEmptyImageSet());
    const [centerIndex, setCenterIndex] = useState<number>(0);
    const _LOADING = "loading";
    const _ERROR = "error";
    const _SUCCESS = "success";
    //#endregion

    //#region START
    useEffect(() => {
        if (posts){
            for (let x = 0; x < posts.length; x++){
                _ImageModelData.AddImageSet(posts[x]);
            }
        }

        //Enable scrolling when closed
        return () => {
            _ScrollController.EnableScrolling();
        }
    }, [posts]);
    //#endregion

    //#region METHODS
    const _OpenModel = (id: string, index: number): void => {
        const imageAsset = _ImageModelData.GetImagePostAsset(id);
        if (!imageAsset.isFullImageSet){
            _LoadFullImageSet(id, imageAsset.fullImageSetId);
        }
        _ScrollController.DisableScrolling();
        applyImageSet(imageAsset.images);
        setCenterIndex(index);
        setModalIsOpen(true);
    }

    const _CloseModel = () => {
        //Note: The PostModal deals with rejecting close requests
        _ScrollController.EnableScrolling();
        setModalIsOpen(false);
    }

    const _OnCenterIndexChanged = (index: number): void => {
        setCenterIndex(index);
    }

    const _LoadFullImageSet = async (postId: string, imageSetIsd: string) => {
        const fullImageSet = await axiosInstance.get(`/api/show_posts/images/${imageSetIsd}`);
        _ImageModelData.AddFullImageSet(postId, fullImageSet.data);
        applyImageSet(fullImageSet.data);
    }

    const _RenderPosts = (): JSX.Element[] => {
        const content = posts!.map((post, index) => {
            if (lastPostRef && index === posts!.length -1){
                return <PostContent
                    post={ post }
                    key={ post.id }
                    onClick={ _OpenModel }
                    showLink = { showLink }
                    ref={lastPostRef}
                    showAdminPanel = { userInfo ? true: false }
                />
            }

            return <PostContent
                post={ post }
                key={ post.id }
                onClick={ _OpenModel }
                showLink = { showLink }
                showAdminPanel = { userInfo ? true: false }
            />
        });
        return content;
    }
    //#endregion

    //#region RENDER
    return (<>
        {/* LOADING STATE */}
        { status === _LOADING &&
            <div className="loading-message">
                Loading Post...
            </div>
        }

        {/* ERROR STATE */}
        { status === _ERROR &&
            <ErrorMessage
                message={ error.response.data.message}
                callStack={ error.response.data.stack }
            />
        }

        {/* SUCCESS STATE */}
        { status == _SUCCESS &&
            <>{ _RenderPosts() }</>
        }

        {/* MODAL */}
        { modalIsOpen &&
            <PostModal
                onClick={ _CloseModel }
                onCenterIndexChanged = { _OnCenterIndexChanged }
                imageSet={ imageSet }
                centerIndex={ centerIndex }
            />
        }
    </>);
    //#endregion
}

//#endregion

//#region POSTCONTENT
const PostContent = React.forwardRef(( { post, onClick, showLink, showAdminPanel }: IPostContent, ref: ForwardedRef<HTMLDivElement>) => {
    const navigate = useNavigate();
    const processedPosts = [] as PostSectionSet[];
    var currentPostSet = {
        type: -1,
        items: [] as PostSection[]
    } as PostSectionSet;

    for (let x = 0; x < post.sections.length; x++){
        const currentItem = post.sections[x];

        if (currentPostSet.type === -1){
            currentPostSet.type = currentItem.type;
        }

        if (currentPostSet.type !== currentItem.type){
            processedPosts.push(currentPostSet as PostSectionSet);
            currentPostSet = {
                type: currentItem.type,
                items: [] as PostSection[]
            } as PostSectionSet;
        }

        currentPostSet.items.push(currentItem as PostSection);
    }

    processedPosts.push(currentPostSet);

    //Build step
    const _sections = (processedPosts.map((set, index) => {
        if (set.type === 0){
            return <TextSetBuilder items= { set.items } id = { post.id }
                key= { index } onClick= { onClick } />
        }
        
        return <ImageSetBuilder items = { set.items } id= { post.id }
            key= { index } onClick= { onClick } />
    }));

    //Methods
    const GetDate = (datePosted: string, lastUpdated: string): string => {
        const wasUpdated = datePosted !== lastUpdated;
        const posted = new Date(datePosted).toLocaleDateString();
        const updated = new Date(lastUpdated).toLocaleDateString();
        let result = `Posted on ${posted}`;
        if (wasUpdated) result += ` (Last updated: ${updated})`;
        return result;
    }
    const OnEdit = () => {
        navigate(`/editpost/${post.id}`);
    }

    const OnDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")){
            return;
        }

        const response = await axiosInstance.delete(`/api/delete_post/${post.id}`);
        if (response.data.status === "Succeeded"){
            return navigate("/success", {
                state: {
                    id: post.id,
                    type: "delete"
                }
            });
        }
        else {
            window.alert("Sorry, could not delete your post.");
        }
    }

    //Render
    const _date = GetDate(post.datePosted, post.lastUpdated);
    return(<div className="panel">
       <h1 className='post-title'>{ post.title }</h1>
       { showAdminPanel &&
        <section className='admin-panel'>
                <button type="button" onClick={ OnEdit } >
                    Edit Post
                </button>
                <button type="button" onClick={ OnDelete }>
                    Delete Post
                </button>
        </section>
       }
       {showLink && <div className='seperate-link'>
            <Link to= { `/getpost/${post.id}` }>View as seperate page</Link>
        </div>}
        <small className='date'>
            { _date }
        </small>
        <div className='post-sections-container'>
            {_sections}
        </div>
        { ref && <div ref={ref} />}
    </div>);
});
//#endregion

//#region TEXT-BUILDERS
const TextSetBuilder: React.FC<ISetBuilder> = ( { items, id, onClick }: ISetBuilder) => {
    const _textItems = (items.map((item, index) => {
        return <TextBuilder  item = { item } id = { id } key = { index } onClick={ onClick } />
    }));

    return (<section className='text-items-section'>
        { _textItems }
    </section>);
}

const TextBuilder: React.FC<IPostSection> = ( { item } : IPostSection ) => {
    const _textGenerator = (text: string) => {
        const result = text.split('\n').map((item, key)=>{
            return <p key={key}>{item}</p>
        });
        const fixedResult = result.filter(item => { return item.props.children !== "\r"});
        return fixedResult;
    }

    return (<>
        { _textGenerator(item.text as string) }
    </>);
}
//#endregion

//#region IMAGE-BUILDERS
const ImageSetBuilder: React.FC<ISetBuilder> = ( { items, id, onClick }: ISetBuilder) => {
    const _imageItems = (items.map((item, index) => {
        return <ImageBuilder  item = { item } id = { id } key = { index } onClick={ onClick } />
    }));

    return (<section className='image-items-section'>
        { _imageItems }
    </section>);
}

const ImageBuilder: React.FC<IPostSection> = ( { item, id, onClick } : IPostSection ) => {
    const handleEvent = (e: SyntheticEvent<HTMLImageElement>) => {
        const img = e.target as HTMLImageElement;

        if (img.naturalHeight > img.naturalWidth){
            img.style.maxHeight = "100%";
            img.style.maxWidth = "auto";
        }
        else {
            img.style.maxWidth = "100%";
            img.style.maxHeight = "auto";
        }
    };

    return (<div className='image-container'>
        <img
            src = { item.imgData }
            alt = { item.imgName }
            title = { item.imgName }
            onLoad = { handleEvent }
            onClick={ () => onClick(id, item.imgIndex as number )}
        />
    </div>);
}
//#endregion

//=== EXPORTS ===//
export { PostPageContent };