import { apiSlice } from './apiSlice';
const START_URL = '/api/new_post';

export const newPostSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
        send: builder.mutation({
            query: (data) => ({
                url: `${START_URL}/`,
                method: 'POST',
                body: data
            })
        })
    })
});

export const { useSendMutation } = newPostSlice;