import { getFeedsApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder, TRequestState } from '@utils-types';

type TFeedState = TRequestState & {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('orders/getAll', async () => {
  const data = await getFeedsApi();
  return data;
});

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    feedOrdersSelector: (state) => state.orders,
    feedTotalSelector: (state) => state.total,
    feedTotalTodaySelector: (state) => state.totalToday,
    feedLoadingSelector: (state) => state.loading,
    feedErrorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты';
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  }
});

export const {
  feedOrdersSelector,
  feedTotalSelector,
  feedTotalTodaySelector,
  feedLoadingSelector,
  feedErrorSelector
} = feedSlice.selectors;
