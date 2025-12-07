import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { getClientRentalConfigByClientId } from "../../../slices/clientRentalConfig/thunk";

export const useClientRentalConfig = (clientId: string | undefined) => {
  const dispatch: any = useDispatch();

  const selectLayoutState = (state: any) => state.ClientRentalConfig;
  const selectConfigProperties = createSelector(selectLayoutState, (state) => ({
    config: state.config,
    loading: state.loading,
    error: state.error,
  }));

  const { config, loading, error } = useSelector(selectConfigProperties);

  useEffect(() => {
    if (clientId) {
      dispatch(getClientRentalConfigByClientId(Number(clientId)));
    }
  }, [dispatch, clientId]);

  return { config, loading, error };
};