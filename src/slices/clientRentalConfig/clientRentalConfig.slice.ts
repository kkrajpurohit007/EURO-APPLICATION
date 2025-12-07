import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getClientRentalConfigs } from "./thunk";

export const fetchClientRentalConfigs = createAsyncThunk(
  "clientRentalConfig/fetchClientRentalConfigs",
  async ({ pageNumber = 1, pageSize = 50 }: { pageNumber?: number; pageSize?: number }, { dispatch }) => {
    const response: any = await dispatch(getClientRentalConfigs());
    return response.payload;
  }
);

interface ClientRentalConfigState {
  configs: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientRentalConfigState = {
  configs: [],
  loading: false,
  error: null,
};

const clientRentalConfigSlice = createSlice({
  name: "clientRentalConfig",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientRentalConfigs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientRentalConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.configs = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchClientRentalConfigs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch client rental configs";
      });
  },
});

export default clientRentalConfigSlice.reducer;