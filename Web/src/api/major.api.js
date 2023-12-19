import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/consts";

const majorApi = createApi({
  reducerPath: "majorsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/majors`,
    timeout: 10_000,
  }),
  tagTypes: ["Majors"],
  endpoints: (builder) => ({
    getMajors: builder.query({
      query: () => ({
        url: "",
        method: "GET"
      })
    })
  }),
});

export const { useGetMajorsQuery } = majorApi;

export default majorApi;
