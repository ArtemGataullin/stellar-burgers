import { getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TRequestState } from '@utils-types';

type TOrderDetailsState = TRequestState & {
  order: TOrder | null;
};

const initialState: TOrderDetailsState = {
  order: null,
  loading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'orderDetails/fetchByNumber',
  async (number: number) => {
    const responce = await getOrderByNumberApi(number);
    if (responce?.orders?.[0]) {
      return responce.orders[0];
    }
    throw new Error('Заказ не найден');
  }
);

export const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    clearOrderDetails: (state) => {
      state.order = null;
      state.error = null;
    }
  },
  selectors: {
    orderDetailsSelector: (state) => state.order,
    orderDetailsLoadingSelector: (state) => state.loading,
    orderDetailsErrorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      });
  }
});

export const { clearOrderDetails } = orderDetailsSlice.actions;
export const {
  orderDetailsSelector,
  orderDetailsLoadingSelector,
  orderDetailsErrorSelector
} = orderDetailsSlice.selectors;
