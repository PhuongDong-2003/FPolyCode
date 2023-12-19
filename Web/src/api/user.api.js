import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/consts";
import { getAccessTokenFromLS, setProfileToLS } from "../utils/utils";
import axios from "axios";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebaseConfig";
import { v4 } from "uuid";
import { isNull, omitBy } from "lodash";

const uploadResourceToCloud = async (resource) => {
  const avatarRef = ref(storage, `avatar/${v4()}`);
  try {
    const task = await uploadBytes(avatarRef, resource);
    const url = await getDownloadURL(task.ref);
    return url;
  } catch (error) {
    throw error;
  }
};

const userApi = createApi({
  reducerPath: "usersAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/users`,
    timeout: 10_000,
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
        headers: {
          Authorization: getAccessTokenFromLS(),
        },
      }),

      providesTags: [{ type: "Users", id: "LIST" }],
    }),

    getCensors: builder.query({
      query: (params) => ({
        url: "censors",
        method: "GET",
        params,
      }),
    }),

    updateProfile: builder.mutation({
      queryFn: async (body) => {
        try {
          let url = null;
          if (body.avatar) {
            url = await uploadResourceToCloud(body.avatar);
          }

          const data = {
            ...body,
            avatar: url,
          };

          const response = await axios({
            url: `${BASE_URL}/users`,
            method: "PUT",
            data,
            headers: {
              Authorization: getAccessTokenFromLS(),
            },
          });

          const dataResposne = response.data;
          return dataResposne;
        } catch (error) {
          return {
            error: {
              status: 400,
              data: {
                message: "Lỗi",
                data: {
                  message: "Cập nhật thông tin không thành công",
                },
              },
            },
          };
        }
      },

      transformResponse: (response) => {
        setProfileToLS(response.data);
        return response;
      },

      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useGetCensorsQuery,
  useUpdateProfileMutation,
} = userApi;

export default userApi;
