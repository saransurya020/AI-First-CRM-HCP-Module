import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createInteraction, listInteractions, updateInteraction, deleteInteraction } from "../../api/apiClient";

export const fetchInteractions = createAsyncThunk(
  "interactions/fetchAll",
  async () => {
    const res = await listInteractions();
    return res.data;
  }
);

export const submitInteraction = createAsyncThunk(
  "interactions/create",
  async (formData) => {
    const res = await createInteraction(formData);
    return res.data;
  }
);

export const editInteraction = createAsyncThunk(
  "interactions/edit",
  async ({ id, data }) => {
    const res = await updateInteraction(id, data);
    return res.data;
  }
);

export const removeInteraction = createAsyncThunk(
  "interactions/delete",
  async (id) => {
    await deleteInteraction(id);
    return id;
  }
);

const interactionSlice = createSlice({
  name: "interactions",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteractions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInteractions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchInteractions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(submitInteraction.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(editInteraction.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(removeInteraction.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export default interactionSlice.reducer;
