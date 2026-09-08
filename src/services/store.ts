import { combineSlices, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredientsSlice } from './slices/ingredients-slice';
import { feedSlice } from './slices/feed-slice';
import { burgerConstructorSlice } from './slices/burger-constructor-slice';
import { orderSlice } from './slices/order-slice';
import { userSlice } from './slices/user-slice';
import { profileOrdersSlice } from './slices/profile-orders-slice';
import { orderDetailsSlice } from './slices/order-details-slice';

const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  orderSlice,
  feedSlice,
  userSlice,
  profileOrdersSlice,
  orderDetailsSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
