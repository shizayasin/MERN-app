import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  type: "info",
};

const noticeSlice = createSlice({
  name: "notice",
  initialState,
  reducers: {
    showNotice: (state, action) => {
      state.message = action.payload?.message || "";
      state.type = action.payload?.type || "info";
    },
    clearNotice: (state) => {
      state.message = "";
      state.type = "info";
    },
  },
});

export const { showNotice, clearNotice } = noticeSlice.actions;
export default noticeSlice.reducer;
