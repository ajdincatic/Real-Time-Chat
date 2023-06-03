import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { endpoints } from "../../shared/constants";
import { User } from "../../shared/interfaces";

const initialState: {
  loading: boolean;
  users: User[];
} = {
  loading: false,
  users: [],
};

export const getUsers = createAsyncThunk(
  "user/getAll",
  async (_data, { rejectWithValue }) => {
    try {
      const response = await axios.get(endpoints.GET_USERS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUsers.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.users = payload;
    });
    builder.addCase(getUsers.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default userSlice.reducer;
