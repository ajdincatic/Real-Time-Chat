import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { endpoints } from "../../shared/constants";
import { UserAfterLogin } from "../../shared/interfaces";

const initialState: {
  loading: boolean;
  user: UserAfterLogin;
  selectedRoomId: string;
} = {
  loading: false,
  user: null,
  selectedRoomId: null,
};

type LoginPayload = {
  username: string;
  password: string;
};

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ username, password }: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        endpoints.LOGIN,
        JSON.stringify({ username, password })
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.selectedRoomId = null;
    },
    setSelectedRoom: (state, { payload }) => {
      if (state.selectedRoomId !== payload.id) {
        state.selectedRoomId = payload.id;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(userLogin.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.user = payload;
    });
    builder.addCase(userLogin.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { logout, setSelectedRoom } = authSlice.actions;

export default authSlice.reducer;
