import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as leadAttachmentService from "../../services/leadAttachmentService";
import {
  LeadAttachmentItem,
  LeadAttachmentResponse,
  LeadAttachmentCreatePayload,
} from "../../services/leadAttachmentService";

interface LeadAttachmentState {
  items: LeadAttachmentItem[];
  loading: boolean;
  error: string | null;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const initialState: LeadAttachmentState = {
  items: [],
  loading: false,
  error: null,
  pageNumber: 1,
  pageSize: 100,
  totalCount: 0,
  totalPages: 0,
};

// Async thunk to fetch lead attachments
export const fetchLeadAttachments = createAsyncThunk(
  "leadAttachments/fetchLeadAttachments",
  async ({
    leadId,
    pageNumber = 1,
    pageSize = 100,
  }: {
    leadId: string;
    pageNumber?: number;
    pageSize?: number;
  }) => {
    const response: LeadAttachmentResponse = await leadAttachmentService.getLeadAttachments(
      leadId,
      pageNumber,
      pageSize
    );
    return response;
  }
);

// Async thunk to upload a new attachment
export const uploadLeadAttachment = createAsyncThunk(
  "leadAttachments/uploadLeadAttachment",
  async (payload: LeadAttachmentCreatePayload) => {
    const response = await leadAttachmentService.uploadLeadAttachment(payload);
    return response;
  }
);

// Async thunk to delete an attachment
export const deleteLeadAttachment = createAsyncThunk(
  "leadAttachments/deleteLeadAttachment",
  async (attachmentId: string) => {
    await leadAttachmentService.deleteLeadAttachment(attachmentId);
    return attachmentId;
  }
);

const leadAttachmentSlice = createSlice({
  name: "LeadAttachments",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearAttachments(state) {
      state.items = [];
      state.totalCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch attachments
      .addCase(fetchLeadAttachments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadAttachments.fulfilled, (state, action) => {
        state.loading = false;
        // Make sure we're correctly handling the items
        state.items = action.payload.items ? action.payload.items.filter((item) => !item.isDeleted) : [];
        state.pageNumber = action.payload.pageNumber;
        state.pageSize = action.payload.pageSize;
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchLeadAttachments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch attachments";
      })
      // Upload attachment
      .addCase(uploadLeadAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadLeadAttachment.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(uploadLeadAttachment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to upload attachment";
      })
      // Delete attachment
      .addCase(deleteLeadAttachment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLeadAttachment.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(deleteLeadAttachment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete attachment";
      });
  },
});

export const { clearError, clearAttachments } = leadAttachmentSlice.actions;
export default leadAttachmentSlice.reducer;

// Selectors
export const selectLeadAttachmentList = (state: any) => state.LeadAttachments.items;
export const selectLeadAttachmentLoading = (state: any) => state.LeadAttachments.loading;
export const selectLeadAttachmentError = (state: any) => state.LeadAttachments.error;
export const selectLeadAttachmentTotalCount = (state: any) => state.LeadAttachments.totalCount;

