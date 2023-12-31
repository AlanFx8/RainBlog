import { apiSlice } from './apiSlice';
const USERS_URL = 'api/user';

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data
            })
        })
    })
});

export const { useLoginMutation } = usersApiSlice;