import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  ClientMeeting,
  ClientMeetingsResponse,
} from "./clientMeeting.fakeData";
import * as clientMeetingService from "../../services/clientMeetingService";

interface ClientMeetingState {
  list: {
    items: ClientMeeting[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    loading: boolean;
  };
  detail: {
    data?: ClientMeeting | null;
    loading: boolean;
  };
  saving: boolean;
  error: string | null;
}

const initialState: ClientMeetingState = {
  list: {
    items: [],
    pageNumber: 1,
    pageSize: 20,
    totalCount: 0,
    totalPages: 0,
    loading: false,
  },
  detail: {
    data: null,
    loading: false,
  },
  saving: false,
  error: null,
};

// Async thunk to fetch client meetings from API
export const fetchClientMeetings = createAsyncThunk(
  "clientMeetings/fetchClientMeetings",
  async ({
    clientId,
    pageNumber = 1,
    pageSize = 20,
  }: {
    clientId?: string;
    pageNumber?: number;
    pageSize?: number;
  } = {}) => {
    const response: ClientMeetingsResponse =
      await clientMeetingService.getAllClientMeetings(
        pageNumber,
        pageSize,
        clientId
      );
    return response;
  }
);

// Async thunk to fetch a single client meeting by ID
export const fetchClientMeetingById = createAsyncThunk(
  "clientMeetings/fetchClientMeetingById",
  async (id: string) => {
    const response: ClientMeeting =
      await clientMeetingService.getClientMeetingById(id);
    return response;
  }
);

// Async thunk to fetch meeting for edit (includes participants)
export const fetchClientMeetingForEdit = createAsyncThunk(
  "clientMeetings/fetchClientMeetingForEdit",
  async ({ id, clientId }: { id: string; clientId: string }) => {
    const response = await clientMeetingService.getClientMeetingForEdit(id, clientId);
    return response;
  }
);

// Async thunk to create a new client meeting
export const createClientMeeting = createAsyncThunk(
  "clientMeetings/createClientMeeting",
  async (data: import("./clientMeeting.fakeData").ClientMeetingPayload) => {
    const response = await clientMeetingService.createClientMeeting(data);
    return response;
  }
);

// Async thunk to update an existing client meeting
export const updateClientMeeting = createAsyncThunk(
  "clientMeetings/updateClientMeeting",
  async ({ id, data }: { id: string; data: Partial<ClientMeeting> }) => {
    const response = await clientMeetingService.updateClientMeeting(id, data);
    return response;
  }
);

// Async thunk to update meeting for edit (includes participants)
export const updateClientMeetingForEdit = createAsyncThunk(
  "clientMeetings/updateClientMeetingForEdit",
  async ({ 
    id, 
    clientId, 
    data 
  }: { 
    id: string; 
    clientId: string; 
    data: import("./clientMeeting.fakeData").ClientMeetingPayload 
  }) => {
    const response = await clientMeetingService.updateClientMeetingForEdit(id, clientId, data);
    return response;
  }
);

// Async thunk to reschedule a client meeting
export const rescheduleClientMeeting = createAsyncThunk(
  "clientMeetings/rescheduleClientMeeting",
  async ({
    id,
    newDate,
    newStartTime,
    newEndTime,
  }: {
    id: string;
    newDate: string;
    newStartTime: string;
    newEndTime: string;
  }) => {
    const response = await clientMeetingService.rescheduleClientMeeting(
      id,
      newDate,
      newStartTime,
      newEndTime
    );
    return response;
  }
);

// Async thunk to delete a client meeting
export const deleteClientMeeting = createAsyncThunk(
  "clientMeetings/deleteClientMeeting",
  async (id: string) => {
    await clientMeetingService.deleteClientMeeting(id);
    return id;
  }
);

const clientMeetingSlice = createSlice({
  name: "ClientMeetings",
  initialState,
  reducers: {
    selectClientMeeting(state, action: PayloadAction<string>) {
      state.detail.data =
        state.list.items.find((m) => m.id === action.payload) || null;
    },
    clearError(state) {
      state.error = null;
    },
    clearDetail(state) {
      state.detail.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch client meetings
      .addCase(fetchClientMeetings.pending, (state) => {
        state.list.loading = true;
        state.error = null;
      })
      .addCase(fetchClientMeetings.fulfilled, (state, action) => {
        state.list.loading = false;
        const newItems = action.payload.items.filter((m) => !m.isDeleted);
        
        // If loading page 1, replace items. Otherwise, append for infinite scroll
        if (action.payload.pageNumber === 1) {
          state.list.items = newItems;
        } else {
          // Append new items, avoiding duplicates
          const existingIds = new Set(state.list.items.map((m) => m.id));
          const uniqueNewItems = newItems.filter((m) => !existingIds.has(m.id));
          state.list.items = [...state.list.items, ...uniqueNewItems];
        }
        
        state.list.pageNumber = action.payload.pageNumber;
        state.list.pageSize = action.payload.pageSize;
        state.list.totalCount = action.payload.totalCount;
        state.list.totalPages = action.payload.totalPages;
      })
      .addCase(fetchClientMeetings.rejected, (state, action) => {
        state.list.loading = false;
        state.error = action.error.message || "Failed to fetch client meetings";
      })
      // Fetch client meeting by ID
      .addCase(fetchClientMeetingById.pending, (state) => {
        state.detail.loading = true;
        state.error = null;
      })
      .addCase(fetchClientMeetingById.fulfilled, (state, action) => {
        state.detail.loading = false;
        state.detail.data = action.payload;
      })
      .addCase(fetchClientMeetingById.rejected, (state, action) => {
        state.detail.loading = false;
        state.error = action.error.message || "Failed to fetch client meeting";
      })
      // Fetch client meeting for edit
      .addCase(fetchClientMeetingForEdit.pending, (state) => {
        state.detail.loading = true;
        state.error = null;
      })
      .addCase(fetchClientMeetingForEdit.fulfilled, (state, action) => {
        state.detail.loading = false;
        state.detail.data = action.payload;
      })
      .addCase(fetchClientMeetingForEdit.rejected, (state, action) => {
        state.detail.loading = false;
        state.error = action.error.message || "Failed to fetch client meeting for edit";
      })
      // Create client meeting
      .addCase(createClientMeeting.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createClientMeeting.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          state.list.items.unshift(action.payload);
          state.list.totalCount += 1;
        }
      })
      .addCase(createClientMeeting.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || "Failed to create client meeting";
      })
      // Update client meeting
      .addCase(updateClientMeeting.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateClientMeeting.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          const index = state.list.items.findIndex(
            (m) => m.id === action.payload.id
          );
          if (index !== -1) {
            state.list.items[index] = action.payload;
          }
          if (state.detail.data?.id === action.payload.id) {
            state.detail.data = action.payload;
          }
        }
      })
      .addCase(updateClientMeeting.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || "Failed to update client meeting";
      })
      // Update client meeting for edit
      .addCase(updateClientMeetingForEdit.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateClientMeetingForEdit.fulfilled, (state, action) => {
        state.saving = false;
        // Handle API response wrapper - response.result contains the meeting
        // action.payload might be ClientMeeting directly or wrapped in { result: ClientMeeting }
        const payload = action.payload as any;
        const meetingData = payload?.result || payload;
        if (meetingData && meetingData.id) {
          // Update in detail store
          state.detail.data = meetingData as ClientMeeting;
          // Update in list store if exists
          const index = state.list.items.findIndex((m) => m.id === meetingData.id);
          if (index !== -1) {
            state.list.items[index] = meetingData as ClientMeeting;
          }
        }
      })
      .addCase(updateClientMeetingForEdit.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || "Failed to update client meeting for edit";
      })
      // Reschedule client meeting
      .addCase(rescheduleClientMeeting.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(rescheduleClientMeeting.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          const index = state.list.items.findIndex(
            (m) => m.id === action.payload.id
          );
          if (index !== -1) {
            state.list.items[index] = action.payload;
          }
          if (state.detail.data?.id === action.payload.id) {
            state.detail.data = action.payload;
          }
        }
      })
      .addCase(rescheduleClientMeeting.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.error.message || "Failed to reschedule client meeting";
      })
      // Delete client meeting
      .addCase(deleteClientMeeting.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteClientMeeting.fulfilled, (state, action) => {
        state.saving = false;
        state.list.items = state.list.items.filter(
          (m) => m.id !== action.payload
        );
        state.list.totalCount -= 1;
        if (state.detail.data?.id === action.payload) {
          state.detail.data = null;
        }
      })
      .addCase(deleteClientMeeting.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || "Failed to delete client meeting";
      });
  },
});

export const { selectClientMeeting, clearError, clearDetail } =
  clientMeetingSlice.actions;
export default clientMeetingSlice.reducer;

// Selectors
export const selectClientMeetingsList = (state: any) =>
  state.ClientMeetings.list.items;
export const selectClientMeetingsByClientId = (state: any, clientId: string) =>
  state.ClientMeetings.list.items.filter((m: ClientMeeting) => m.clientId === clientId);
export const selectClientMeetingById = (state: any, id: string) =>
  state.ClientMeetings.detail.data ||
  state.ClientMeetings.list.items.find((m: ClientMeeting) => m.id === id);
export const selectClientMeetingLoading = (state: any) =>
  state.ClientMeetings.list.loading;
export const selectClientMeetingDetailLoading = (state: any) =>
  state.ClientMeetings.detail.loading;
export const selectClientMeetingSaving = (state: any) =>
  state.ClientMeetings.saving;
export const selectClientMeetingError = (state: any) =>
  state.ClientMeetings.error;
export const selectClientMeetingPagination = (state: any) => ({
  pageNumber: state.ClientMeetings.list.pageNumber,
  pageSize: state.ClientMeetings.list.pageSize,
  totalCount: state.ClientMeetings.list.totalCount,
  totalPages: state.ClientMeetings.list.totalPages,
});

