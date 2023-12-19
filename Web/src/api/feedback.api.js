import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../utils/consts";
import { getAccessTokenFromLS } from "../utils/utils";

const feedbackApi = createApi({
  reducerPath: "feedbackAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/feedbacks`,
    timeout: 10_000,
  }),
  tagTypes: ["Feedbacks"],
  endpoints: (builder) => ({
    getFeedback: builder.query({
      query: (project_id) => ({
        url: `${project_id}`,
        method: "GET"
      })
    })
  }),
});

export const { useGetFeedbackQuery } = feedbackApi;

export default feedbackApi;
