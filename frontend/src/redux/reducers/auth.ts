import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { endpoints } from "../../shared/constants";
import { RegisterUserPayload, UserAfterLogin } from "../../shared/interfaces";

const initialState: {
  loading: boolean;
  user: UserAfterLogin;
} = {
  loading: false,
  user: null,
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

export const register = async (data: RegisterUserPayload) => {
  await axios
    .post(endpoints.REGISTER, {
      ...data,
    })
    .catch((err) => {
      console.error(err.message);
    });
};

export const { logout } = authSlice.actions;

export default authSlice.reducer;
