import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { endpoints } from "../../shared/constants";
import { Room, Message } from "../../shared/interfaces";

const initialState: {
  loading: boolean;
  room: Room;
  messages: Message[];
} = {
  loading: false,
  room: null,
  messages: [],
};

export const getRoomMessages = createAsyncThunk(
  "room/messages",
  async ({ roomId }: { roomId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${endpoints.ROOM_BY_ID}${roomId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const roomMessagesSlice = createSlice({
  name: "roomMessages",
  initialState,
  reducers: {
    addMessage: (state, { payload }) => {
      state.messages = [...state.messages, payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRoomMessages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getRoomMessages.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.room = payload.room;
      state.messages = payload.messages;
    });
    builder.addCase(getRoomMessages.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const sendMessage = async (message: string, toRoomId: string) => {
  await axios
    .post(endpoints.SEND_MESSAGE, {
      message,
      roomId: toRoomId,
    })
    .catch((err) => {
      console.error(err.message);
    });
};

export const { addMessage } = roomMessagesSlice.actions;

export default roomMessagesSlice.reducer;
