import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from "../axios/axiosInstance";
import { Link } from 'react-router-dom';
import '../styles/list-posts.scss';

interface IListPostContent {
    list: { title: string, _id: string, createdAt: string }[]
}

const ListPosts: React.FC = () => {
    const _FetchPostList = async () => {
        const response = await axiosInstance.get("/api/show_posts/list");
        return response.data;
    }

    const _queryParams = {
        retry: false,
        refetchOnWindowFocus: false
    }
    
    const _query = useQuery(["listposts"], _FetchPostList, _queryParams);
    const { data, status } = _query;
    const error = _query.error as Error;

    return (<>
        {/* LOADING STATE */}
        { status === "loading" &&
            <div className="loading-message">Loading Post...</div>
        }

        {/* ERROR STATE */}
        { status === "error" && <div className="error-message">
            Sorry, there was an error: <br/> { error.message }
        </div> }

        {/* SUCCESS STATE */}
        { status == "success" && <div className="panel padded stylized-text">
                <ListPostsContent list={ data } />
        </div> }
    </>);
}

const ListPostsContent: React.FC<IListPostContent> = ({ list }) => {
    const _list = list.map((item, index) => {
        return <li className='list-posts-li' key={index}>
            <Link to= { `/getpost/${item._id}` }>{ item.title }</Link>
        </li>
    });

    return (<ul>
        <li className='list-posts-li'>
            <Link to= { `/allposts/` }>ALL POSTS</Link>
        </li>
        { _list }
    </ul>);
}

export default ListPosts;