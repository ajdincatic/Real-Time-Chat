import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { endpoints } from "../../shared/constants";
import { Room } from "../../shared/interfaces";

const initialState: {
  loading: boolean;
  myRooms: Room[];
} = {
  loading: false,
  myRooms: [],
};

export const getMyRooms = createAsyncThunk(
  "room/me",
  async (_data, { rejectWithValue }) => {
    try {
      const response = await axios.get(endpoints.MY_ROOMS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    updateRoomsList: (state, { payload }) => {
      const updatedList = state.myRooms.map((el) => {
        if (el.entityId !== payload.roomId) {
          return el;
        }

        return {
          ...el,
          lastMessage: payload,
          className: "new-message-chat-list",
        };
      });

      state.myRooms = updatedList.sort((a, b) => {
        const timestampA = a.lastMessage?.timestamp
          ? new Date(a.lastMessage.timestamp).getTime()
          : 0;
        const timestampB = b.lastMessage?.timestamp
          ? new Date(b.lastMessage.timestamp).getTime()
          : 0;
        return timestampB - timestampA;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMyRooms.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getMyRooms.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.myRooms = payload;
    });
    builder.addCase(getMyRooms.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { updateRoomsList } = roomSlice.actions;

export default roomSlice.reducer;
