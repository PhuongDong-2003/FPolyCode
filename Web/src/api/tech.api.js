import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/consts";

const techsApi = createApi({
  reducerPath: "techsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/techs`,
    timeout: 10_000,
  }),
  tagTypes: ["Techs"],
  endpoints: (builder) => ({
    getTechs: builder.query({
      query: () => ({
        url: "",
        method: "GET"
      })
    })
  }),
});

export const { useGetTechsQuery } = techsApi;

export default techsApi;
