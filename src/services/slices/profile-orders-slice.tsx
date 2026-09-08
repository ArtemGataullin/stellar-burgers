import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TRequestState } from '@utils-types';

type TProfileOrdersState = TRequestState & {
  orders: TOrder[];
};

const initialState: TProfileOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk<TOrder[]>(
  'profileOrders/fetchAll',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  selectors: {
    profileOrdersSelector: (state) => state.orders,
    profileOrdersLoadingSelector: (state) => state.loading,
    profileOrdersErrorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      });
  }
});

export const {
  profileOrdersSelector,
  profileOrdersLoadingSelector,
  profileOrdersErrorSelector
} = profileOrdersSlice.selectors;
