import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder, TRequestState } from '@utils-types';

type TOrderState = TRequestState & {
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  loading: false,
  error: null
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'order/create',
  async (data: string[]) => {
    const res = await orderBurgerApi(data);
    return {
      ...res.order,
      ingredients: []
    } as TOrder;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderModalData = null;
      state.error = null;
    }
  },
  selectors: {
    orderRequestSelector: (state) => state.orderRequest,
    orderModalDataSelector: (state) => state.orderModalData,
    orderErrorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.loading = false;
        state.error = action.error.message || 'Ошибка при отправке заказа';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.loading = false;
        state.orderModalData = action.payload;
      });
  }
});

export const { clearOrderData } = orderSlice.actions;
export const {
  orderRequestSelector,
  orderModalDataSelector,
  orderErrorSelector
} = orderSlice.selectors;
