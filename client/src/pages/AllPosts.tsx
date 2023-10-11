import React, { useRef, useCallback, useState } from 'react';
import axiosInstance from "../axios/axiosInstance";
import { useInfiniteQuery } from '@tanstack/react-query'
import { PostPageContent } from "../components/PostComponents";

///THE ALL POSTS PAGE///
let _NoMorePosts = false;
const AllPosts: React.FC = () => {
    //#region START
    const getPost = async (pageNo: number) => {
        const response = await axiosInstance.get(`/api/show_posts/page/${pageNo}`);
        return response.data;
    }

    const {
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        data,
        status,
        error
    } = useInfiniteQuery(['allposts'], ({ pageParam = 1 }) => getPost(pageParam), {
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.isLastPost) {
                _NoMorePosts = true;
            }
            return lastPage.isLastPost ? undefined : allPages.length + 1
        }
    });
    const _error = error as Error || null;
    //#endregion

    //#region REF-N-CALLBACK
    const intObserver = useRef<IntersectionObserver>();

    const lastPostRef = useCallback((post: HTMLDivElement) => {
        if (isFetchingNextPage) return;
        if (intObserver.current) intObserver.current.disconnect();
        intObserver.current = new IntersectionObserver(posts => {
            if (posts[0].isIntersecting && hasNextPage) {                
                fetchNextPage();
            }
        });
        if (post) intObserver.current.observe(post);
    }, [isFetchingNextPage, fetchNextPage, hasNextPage]);
    //#endregion

    //#region RENDER
    return (<>
        <PostPageContent
            posts={ data? data.pages : null }
            lastPostRef={ lastPostRef }
            status= { status }
            showLink = { true }
            error = { _error }
        />

        {/* NO MORE POSTS*/}
        { _NoMorePosts &&
            <div className="panel padded stylized-text bold-centered">NO MORE POSTS</div>
        }
    </>);
    //#endregion
}

//EXPORT
export default AllPosts;