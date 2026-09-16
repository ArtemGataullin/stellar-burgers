import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { generateId } from '../../utils/generate-id';
import { getIngredientsApi } from '@api';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  isLoading: boolean;
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  isLoading: false
};

const getIngredients = createAsyncThunk(
  'burgerConstructor/getIngredients',
  async () => {
    const res = await getIngredientsApi();
    return res;
  }
);

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: crypto.randomUUID()
        }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ currentIndex: number; targetIndex: number }>
    ) => {
      const { currentIndex, targetIndex } = action.payload;
      const ingredient = state.ingredients.splice(currentIndex, 1)[0];
      state.ingredients.splice(targetIndex, 0, ingredient);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    constructorItemsSelector: (state) => state,
    bunSelector: (state) => state.bun,
    ingredientsSelector: (state) => state.ingredients,
    areIngredientsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload.map((ing) => ({
          ...ing,
          id: generateId()
        }));
      })
      .addCase(getIngredients.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;
export const {
  constructorItemsSelector,
  bunSelector,
  ingredientsSelector,
  areIngredientsLoading
} = burgerConstructorSlice.selectors;
