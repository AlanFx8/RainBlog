import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import axiosInstance from "../axios/axiosInstance";
import { PostPageContent } from "../components/PostComponents";

//THE GET POST PAGE
const GetPost: React.FC = () => {
    ///=== START ===///
    const {id} = useParams();

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
    const error = _query.error as Error || null;

    //=== RENDER ===//
    return (
        <PostPageContent
            posts={ data ? [data] : null }
            lastPostRef={ null }
            status= { status }
            showLink = { false }
            error = { error }
        />
    );
}

//EXPORT
export default GetPost;