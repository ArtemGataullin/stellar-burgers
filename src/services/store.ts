import { combineReducers, configureStore } from '@reduxjs/toolkit';
import feedReducer from './feed-slice';
import ingredientsReducer from './ingredients-slice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import constructorReducer from './constructor-slice';

const rootReducer = combineReducers({
  feed: feedReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
