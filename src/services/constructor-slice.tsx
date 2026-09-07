import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export const getIngredients = createAsyncThunk('ingredients/getAll', async () =>
  getIngredientsApi()
);

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'BurgerIngredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredientsLoading: (state) => state.isLoading,
    selectBuns: (state) =>
      state.ingredients.filter((item) => item.type === 'bun'),
    selectMains: (state) =>
      state.ingredients.filter((item) => item.type === 'main'),
    selectSauces: (state) =>
      state.ingredients.filter((item) => item.type === 'sauce')
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export const {
  selectIngredientsLoading,
  selectBuns,
  selectMains,
  selectSauces
} = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
