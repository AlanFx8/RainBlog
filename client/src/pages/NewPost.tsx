import React from "react";
import { BuildPost } from '../components/NewPostComponents';
import '../styles/new-post.scss';

///THE NEW POST PAGE///
//Acts as wrapper for the BuildPost component
const NewPost: React.FC = () => {
    //#region RENDER
    return (<>
        <BuildPost post = { null }/>
    </>);
    //#endregion
}

//Export
export default NewPost;