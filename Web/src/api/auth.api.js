import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/consts";
import { clearLS, getAccessTokenFromLS, setAccessTokenToLS, setProfileToLS } from "../utils/utils";

const authApi = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}`,
    timeout: 10_000,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body
      }),

      transformResponse: (response) => {
        setAccessTokenToLS(response.data.access_token)
        setProfileToLS(response.data.user)
        return response
      },

      transformErrorResponse: (error) => error
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "DELETE",
        headers: {
          Authorization: getAccessTokenFromLS(),
        },
      }),
      
      transformResponse: (response) => {
        clearLS()
        return response;
      }
    })
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;

export default authApi;
