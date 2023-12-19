import { createSlice } from "@reduxjs/toolkit"
import { getAccessTokenFromLS, getProfileFromLS } from "../../../utils/utils"

const initialState = {
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  profile: getProfileFromLS()
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    authenticated: (state, action) => {
      state.isAuthenticated = action.payload
    },
    profile: (state, action) => {
      state.profile = action.payload
    },
  }
})

export const { authenticated, profile } = appSlice.actions

export default appSlice.reducer