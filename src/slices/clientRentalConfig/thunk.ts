import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getClientRentalConfigs as getClientRentalConfigsApi,
  getClientRentalConfigByClientId as getClientRentalConfigByClientIdApi,
  updateClientRentalConfig as updateClientRentalConfigApi,
} from "../../helpers/fakebackend_helper";

export const getClientRentalConfigs = createAsyncThunk(
  "clientRentalConfig/getClientRentalConfigs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getClientRentalConfigsApi();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getClientRentalConfigByClientId = createAsyncThunk(
  "clientRentalConfig/getClientRentalConfigByClientId",
  async (clientId: number, { rejectWithValue }) => {
    try {
      const response = await getClientRentalConfigByClientIdApi(clientId);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateClientRentalConfig = createAsyncThunk(
  "clientRentalConfig/updateClientRentalConfig",
  async (config: any, { rejectWithValue }) => {
    try {
      const response = await updateClientRentalConfigApi(config.clientId, config);
      const data = await response;
      toast.success("Client Rental Configuration Updated Successfully", {
        autoClose: 3000,
      });
      return data;
    } catch (error) {
      toast.error("Client Rental Configuration Update Failed", {
        autoClose: 3000,
      });
      return rejectWithValue(error);
    }
  }
);