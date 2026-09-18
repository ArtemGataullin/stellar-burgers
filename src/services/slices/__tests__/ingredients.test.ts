import { expect, test, describe } from '@jest/globals';
import {
  ingredientsSelector,
  ingredientsLoadingSelector,
  errorSelector,
  fetchIngredients,
  ingredientsSlice
} from '../ingredients-slice';
import { TIngredient } from '@utils-types';
import store, { RootState } from '../../store';

const reducer = ingredientsSlice.reducer;

type TIngredientsState = ReturnType<typeof reducer>;

describe('тесты редьюсеров слайса burger-сonstructor-slice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  const mockIngridients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa093f',
      name: 'Мясо бессмертных моллюсков Protostomia',
      type: 'main',
      proteins: 433,
      fat: 244,
      carbohydrates: 33,
      calories: 420,
      price: 1337,
      image: 'https://code.s3.yandex.net/react/code/meat-02.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png'
    }
  ];

  const makeRootState = (
    partial: Partial<TIngredientsState> = {}
  ): RootState => ({
    ...store.getState(),
    ingredients: { ...initialState, ...partial }
  });

  test('Тестирование несуществующего экшена', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  describe('fetchIngredients', () => {
    test('pending: включает loading и сбрасывает error', () => {
      const state = reducer(
        { ...initialState, error: 'старая ошибка' },
        fetchIngredients.pending('')
      );

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual([]);
    });

    test('fulfilled: сохраняет ингредиенты и выключает loading', () => {
      const state = reducer(
        { ...initialState, loading: true },
        fetchIngredients.fulfilled(mockIngridients, '')
      );

      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngridients);
      expect(state.error).toBeNull();
    });

    test('rejected: сохраняет сообщение об ошибке и выключает loading', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const state = reducer(
        { ...initialState, loading: true },
        fetchIngredients.rejected(new Error(errorMessage), '')
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    test('rejected без message: подставляет дефолтный текст', () => {
      const error = new Error();
      // @ts-expect-error — эмулируем отсутствие message
      error.message = undefined;

      const state = reducer(
        { ...initialState, loading: true },
        fetchIngredients.rejected(error, '')
      );

      expect(state.error).toBe('Ошибка загрузки ингредиентов');
    });
  });

  describe('селекторы', () => {
    test('ingredientsSelector возвращает массив ингредиентов', () => {
      const rootState = makeRootState({ ingredients: mockIngridients });
      expect(ingredientsSelector(rootState)).toEqual(mockIngridients);
    });

    test('ingredientsSelector на пустом state возвращает []', () => {
      expect(ingredientsSelector(makeRootState())).toEqual([]);
    });

    test('ingredientsLoadingSelector возвращает loading', () => {
      expect(ingredientsLoadingSelector(makeRootState())).toBe(false);
      expect(ingredientsLoadingSelector(makeRootState({ loading: true }))).toBe(
        true
      );
    });

    test('errorSelector возвращает error', () => {
      const error = 'Test error';
      expect(errorSelector(makeRootState())).toBeNull();
      expect(errorSelector(makeRootState({ error }))).toBe(error);
    });
  });
});
