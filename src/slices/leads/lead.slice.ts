import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { initialLeads, LeadItem, LeadsResponse } from "./lead.fakeData";
import * as leadService from "../../services/leadService";

interface LeadState {
  items: LeadItem[];
  selectedLead: LeadItem | null;
  loading: boolean;
  error: string | null;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const initialState: LeadState = {
  items: initialLeads,
  selectedLead: null,
  loading: false,
  error: null,
  pageNumber: 1,
  pageSize: 500,
  totalCount: 0,
  totalPages: 0,
};

// Async thunk to fetch leads from API
export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async ({
    pageNumber = 1,
    pageSize = 500,
  }: {
    pageNumber?: number;
    pageSize?: number;
  } = {}) => {
    const response: LeadsResponse = await leadService.getAllLeads(
      pageNumber,
      pageSize
    );
    return response;
  }
);

// Async thunk to create a new lead
export const createLead = createAsyncThunk(
  "leads/createLead",
  async (data: Partial<LeadItem>) => {
    const response = await leadService.createLead(data);
    return response;
  }
);

// Async thunk to update an existing lead
export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async ({ id, data }: { id: string; data: Partial<LeadItem> }) => {
    const response = await leadService.updateLead(id, data);
    return response;
  }
);

// Async thunk to delete a lead
export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async (id: string) => {
    await leadService.deleteLead(id);
    return id;
  }
);

const leadSlice = createSlice({
  name: "Leads",
  initialState,
  reducers: {
    selectLead(state, action: PayloadAction<string>) {
      state.selectedLead =
        state.items.find((l) => l.id === action.payload) || null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch leads
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch leads";
      })
      // Create lead
      .addCase(createLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(createLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create lead";
      })
      // Update lead
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update lead";
      })
      // Delete lead
      .addCase(deleteLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((l) => l.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete lead";
      });
  },
});

export const { selectLead, clearError } = leadSlice.actions;
export default leadSlice.reducer;

// selectors
export const selectLeadList = (state: any) => state.Leads.items;
export const selectSelectedLead = (state: any) => state.Leads.selectedLead;
export const selectLeadById = (state: any, id: string) =>
  state.Leads.items.find((l: LeadItem) => l.id === id);
export const selectLeadLoading = (state: any) => state.Leads.loading;
export const selectLeadError = (state: any) => state.Leads.error;
export const selectLeadTotalCount = (state: any) => state.Leads.totalCount;
