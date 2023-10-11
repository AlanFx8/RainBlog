import React from 'react';
import { useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import axiosInstance from "../axios/axiosInstance";
import { BuildPost } from '../components/NewPostComponents';
import '../styles/new-post.scss';

///THE EDIT POST PAGE///
const EditPost: React.FC = () => {
    //#region FIELDS
    const {id} = useParams();
    //#endregion

    //#region START
    const fetcher = async () => {
        const response = await axiosInstance.get(`/api/show_posts/${id}`);
        return response.data;
    }

    const _queryParams = {
        retry: false,
        refetchOnWindowFocus: false
    }
    
    const _query = useQuery([id], fetcher, _queryParams);
    const { data, status } = _query;
    const error = _query.error as Error;
    //#endregion

    //#region RENDER
    return(<>
        {/* LOADING STATE */}
        { status === "loading" &&
            <div className="loading-message">Loading Post...</div>
        }

        {/* ERROR STATE */}
        { status === "error" && <div className="error-message">
            Sorry, there was an error: <br/> { error.message }
        </div>}

        {/* SUCCESS STATE */}
        { status == "success" &&
            <BuildPost post = { data }/>
        }
    </>);
    //#endregion
}

//EXPORT
export default EditPost;