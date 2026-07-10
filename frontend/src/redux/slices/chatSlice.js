import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendChatMessage } from "../../api/apiClient";

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ message, sessionId, repId }) => {
    const res = await sendChatMessage(message, sessionId, repId);
    return { userMessage: message, ...res.data };
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],   // [{ role: 'user'|'assistant', content: '...' }]
    status: "idle",
    lastInteractionId: null,
  },
  reducers: {
    clearChat: (state) => {
      state.messages = [];
      state.status = "idle";
      state.lastInteractionId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.status = "loading";
        state.messages.push({ role: "user", content: action.meta.arg.message });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages.push({ role: "assistant", content: action.payload.reply });
        if (action.payload.interaction_id) {
          state.lastInteractionId = action.payload.interaction_id;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.messages.push({ role: "assistant", content: "Sorry, something went wrong. Please try again." });
      });
  },
});

export const { clearChat } = chatSlice.actions;
export default chatSlice.reducer;
