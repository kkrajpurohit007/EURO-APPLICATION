import { APIClient } from "../helpers/api_helper";
import * as url from "../helpers/url_helper";
import { getCountries } from "../helpers/fakebackend_helper";
import { CountriesResponse } from "../slices/countries/country.fakeData";

const api = new APIClient();

// Check if we should use the fake backend
const isFakeBackend = process.env.REACT_APP_DEFAULTAUTH === "jwt";

export const getAllCountries = (
  pageNumber: number = 1,
  pageSize: number = 50
): Promise<CountriesResponse> => {
  if (isFakeBackend) {
    return getCountries(
      pageNumber,
      pageSize
    ) as unknown as Promise<CountriesResponse>;
  }
  // Real API call with query parameters
  return api.get(url.GET_COUNTRIES, {
    pageNumber,
    pageSize,
  }) as unknown as Promise<CountriesResponse>;
};
