import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CountryItem, CountriesResponse } from "./country.fakeData";
import * as countryService from "../../services/countryService";

interface CountryState {
  countries: CountryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CountryState = {
  countries: [],
  loading: false,
  error: null,
};

// Async thunk to fetch countries from API
export const fetchCountries = createAsyncThunk(
  "countries/fetchCountries",
  async ({
    pageNumber = 1,
    pageSize = 50,
  }: {
    pageNumber?: number;
    pageSize?: number;
  } = {}) => {
    const response: CountriesResponse = await countryService.getAllCountries(
      pageNumber,
      pageSize
    );
    // Filter out deleted countries
    const activeCountries = response.items.filter((item) => !item.isDeleted);
    return {
      ...response,
      items: activeCountries,
    };
  }
);

const countrySlice = createSlice({
  name: "Countries",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch countries
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.countries = action.payload.items;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch countries";
      });
  },
});

export const { clearError } = countrySlice.actions;
export default countrySlice.reducer;

// Selectors
export const selectCountryList = (state: any) => state.Countries.countries;
export const selectCountryById = (state: any, id: string) =>
  state.Countries.countries.find((c: CountryItem) => c.id === id);
export const selectCountryLoading = (state: any) => state.Countries.loading;
export const selectCountryError = (state: any) => state.Countries.error;
