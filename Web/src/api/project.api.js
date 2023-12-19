import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/consts";
import { getAccessTokenFromLS } from "../utils/utils";
import axios from "axios";
import { storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 } from "uuid";
import { isNull, omitBy } from "lodash";

const uploadResourceToCloud = async (resource) => {
  const videoRef = ref(storage, `video/${v4()}`);
  const thumbnailRef = ref(storage, `thumbnail/${v4()}`);
  const sourceRef = ref(storage, `source/${v4()}_${resource.source.name}`);

  const dataMap = new Map();
  dataMap.set(videoRef, resource.video.data);
  dataMap.set(thumbnailRef, resource.thumbnail.data);
  dataMap.set(sourceRef, resource.source.data);

  const promises = [];

  for (const [key, value] of dataMap.entries()) {
    const url = await uploadProcess(key, value);
    promises.push(url);
  }

  return promises;
};

const uploadProcess = (ref, data) => {
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(ref, data);
    task.on(
      "state_changed",
      (_) => {},
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(task.snapshot.ref).then((downloadUrl) => {
          resolve(downloadUrl);
        });
      }
    );
  });
};

const projectApi = createApi({
  reducerPath: "projectAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/projects`,
    timeout: 10_000,
  }),
  tagTypes: ["Projects", "Auth", "Censor"],
  keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),

      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((product) => ({
                type: "Projects",
                id: product.id,
              })),
              { type: "Projects", id: "LIST" },
            ]
          : [{ type: "Projects", id: "LIST" }],
    }),

    getProjectOfUser: builder.query({
      query: (params) => ({
        url: "auth",
        method: "GET",
        params,
        headers: {
          Authorization: getAccessTokenFromLS(),
        },
      }),

      providesTags: (result) =>
        result.data
          ? [
              ...result.data.map((product) => ({
                type: "Projects",
                id: product.id,
              })),
              { type: "Auth", id: "LIST" },
            ]
          : [{ type: "Auth", id: "LIST" }],
    }),

    getProjectProcess: builder.query({
      query: (params) => ({
        url: "censor",
        method: "GET",
        params,
        headers: {
          Authorization: getAccessTokenFromLS(),
        },
      }),

      providesTags: [{ type: "Censor", id: "LIST" }],
    }),

    getProject: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),

      providesTags: ["Projects"],
    }),

    createProject: builder.mutation({
      queryFn: async (body) => {
        try {
          const promises = await uploadResourceToCloud(body.resource);
          const promiseData = await Promise.all(promises);
          const [videoPath, thumbnailPath, sourcePath] = promiseData;

          const data = {
            ...body.data,
            videoPath,
            thumbnailPath,
            sourcePath,
          };

          const response = await axios({
            url: `${BASE_URL}/projects`,
            method: "POST",
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
                  message: "Tạo dự án mới không thành công",
                },
              },
            },
          };
        }
      },

      invalidatesTags: [{ type: "Censor" }],
    }),

    updateProject: builder.mutation({
      queryFn: async (body) => {
        try {
          let thumbnailUrl = null;
          if (body.resource?.thumbnail.data) {
            const thumbnailRef = ref(storage, `thumbnail/${v4()}`);
            thumbnailUrl = await uploadProcess(
              thumbnailRef,
              body.resource.thumbnail.data
            );
          }

          let sourceUrl = null;
          if (body.resource?.source.data) {
            const sourceRef = ref(
              storage,
              `source/${v4()}_${body.resource.source.name}`
            );
            sourceUrl = await uploadProcess(
              sourceRef,
              body.resource.source.data
            );
          }

          const promiseData = omitBy([thumbnailUrl, sourceUrl], isNull);
          await Promise.all(Object.values(promiseData));

          const data = {
            ...body.data,
            thumbnail: thumbnailUrl,
            source: sourceUrl,
          };

          const response = await axios({
            url: `${BASE_URL}/projects`,
            method: "PUT",
            data,
            headers: {
              Authorization: getAccessTokenFromLS(),
            },
          });
          const dataResponse = response.data;
          return dataResponse;
        } catch (error) {
          return {
            error: {
              status: 400,
              data: {
                message: "Lỗi",
                data: {
                  message: "Cập nhật dự án không thành công",
                },
              },
            },
          };
        }
      },

      invalidatesTags: [
        { type: "Censor", id: "LIST" },
        { type: "Projects", id: "LIST" },
        { type: "Auth", id: "LIST" },
      ],
    }),

    updateStatusProject: builder.mutation({
      query: (body) => ({
        url: "",
        method: "PUT",
        body,
        headers: {
          Authorization: getAccessTokenFromLS(),
        },
      }),

      invalidatesTags: [
        { type: "Censor", id: "LIST" },
        { type: "Projects", id: "LIST" },
      ],
    }),

    updateViewProject: builder.mutation({
      query: (body) => ({
        url: "view",
        method: "PUT",
        body
      }),

      invalidatesTags: [{ type: 'Projects' }]
    }),

    deleteProject: builder.mutation({
      query: (ids) => ({
        url: "dlt",
        method: "DELETE",
        body: ids,
        headers: {
          Authorization: getAccessTokenFromLS(),
        },
      }),

      invalidatesTags: [
        { type: "Projects", id: "LIST" },
        { type: "Auth", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectOfUserQuery,
  useGetProjectProcessQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useUpdateStatusProjectMutation,
  useUpdateViewProjectMutation,
  useDeleteProjectMutation,
} = projectApi;

export default projectApi;
