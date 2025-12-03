import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  ClientSiteItem,
  ClientSitesResponse,
} from "./clientSite.fakeData";
import * as clientSiteService from "../../services/clientSiteService";

interface ClientSiteState {
  items: ClientSiteItem[];
  selectedSite: ClientSiteItem | null;
  loading: boolean;
  error: string | null;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const initialState: ClientSiteState = {
  items: [],
  selectedSite: null,
  loading: false,
  error: null,
  pageNumber: 1,
  pageSize: 50,
  totalCount: 0,
  totalPages: 0,
};

// Async thunk to fetch client sites from API
export const fetchClientSites = createAsyncThunk(
  "clientSites/fetchClientSites",
  async ({
    pageNumber = 1,
    pageSize = 50,
  }: {
    pageNumber?: number;
    pageSize?: number;
  } = {}) => {
    const response: ClientSitesResponse = await clientSiteService.getAllClientSites(
      pageNumber,
      pageSize
    );
    return response;
  }
);

// Async thunk to create a new client site
export const createClientSite = createAsyncThunk(
  "clientSites/createClientSite",
  async (data: Partial<ClientSiteItem>) => {
    const response = await clientSiteService.createClientSite(data);
    return response;
  }
);

// Async thunk to update an existing client site
export const updateClientSite = createAsyncThunk(
  "clientSites/updateClientSite",
  async ({ id, data }: { id: string; data: Partial<ClientSiteItem> }) => {
    const response = await clientSiteService.updateClientSite(id, data);
    return response;
  }
);

// Async thunk to delete a client site
export const deleteClientSite = createAsyncThunk(
  "clientSites/deleteClientSite",
  async (id: string) => {
    await clientSiteService.deleteClientSite(id);
    return id;
  }
);

const clientSiteSlice = createSlice({
  name: "ClientSites",
  initialState,
  reducers: {
    selectClientSite(state, action: PayloadAction<string>) {
      state.selectedSite =
        state.items.find((s) => s.id === action.payload) || null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch client sites
      .addCase(fetchClientSites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientSites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchClientSites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch client sites";
      })
      // Create client site
      .addCase(createClientSite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClientSite.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createClientSite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create client site";
      })
      // Update client site
      .addCase(updateClientSite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClientSite.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateClientSite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update client site";
      })
      // Delete client site
      .addCase(deleteClientSite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClientSite.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((s) => s.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteClientSite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete client site";
      });
  },
});

export const { selectClientSite, clearError} = clientSiteSlice.actions;
export default clientSiteSlice.reducer;

// Selectors
export const selectClientSiteList = (state: any) => state.ClientSites.items;
export const selectSelectedClientSite = (state: any) => state.ClientSites.selectedSite;
export const selectClientSiteById = (state: any, id: string) =>
  state.ClientSites.items.find((s: ClientSiteItem) => s.id === id);
export const selectClientSiteLoading = (state: any) => state.ClientSites.loading;
export const selectClientSiteError = (state: any) => state.ClientSites.error;
export const selectClientSiteTotalCount = (state: any) => state.ClientSites.totalCount;
