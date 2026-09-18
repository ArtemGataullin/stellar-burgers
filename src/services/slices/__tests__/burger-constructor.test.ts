import { expect, test, describe } from '@jest/globals';
import {
  addIngredient,
  moveIngredient,
  removeIngredient,
  clearConstructor,
  constructorItemsSelector,
  bunSelector,
  ingredientsSelector,
  areIngredientsLoading,
  getIngredients
} from '../burger-constructor-slice';
import { burgerConstructorSlice } from '../burger-constructor-slice';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { generateId } from '../../../utils/generate-id';

jest.mock('../../../utils/generate-id');
const mockedGenerateId = generateId as jest.MockedFunction<typeof generateId>;

const reducer = burgerConstructorSlice.reducer;

describe('тесты редьюсеров слайса burger-сonstructor-slice', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    isLoading: false
  };

  const mockBun: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    id: 'bun-1'
  };

  const mockIngridient1: TConstructorIngredient = {
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
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    id: 'ing-1'
  };

  const mockIngridient2: TConstructorIngredient = {
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
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
    id: 'ing-2'
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

  const mockSauc: TConstructorIngredient = {
    _id: '643d69a5c3f7b9001cfa0944',
    name: 'Соус традиционный галактический',
    type: 'sauce',
    proteins: 42,
    fat: 24,
    carbohydrates: 42,
    calories: 99,
    price: 15,
    image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
    id: 'sauc-1'
  };

  test('Тестирование несуществующего экшена', () => {
    const state = reducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  describe('addIngredient', () => {
    test('Добавление булок в state.bun', () => {
      const uuidSpy = jest
        .spyOn(globalThis.crypto, 'randomUUID')
        .mockReturnValue(
          'bun-1' as `${string}-${string}-${string}-${string}-${string}`
        );

      const newState = reducer(initialState, addIngredient(mockBun));

      expect(newState.bun).toEqual({ ...mockBun, id: 'bun-1' });
      expect(newState.ingredients).toEqual([]);
      uuidSpy.mockRestore();
    });

    test('Добавление булок в state.ingredients', () => {
      const uuidSpy = jest
        .spyOn(globalThis.crypto, 'randomUUID')
        .mockReturnValue(
          'ing-1' as `${string}-${string}-${string}-${string}-${string}`
        );

      const newState = reducer(initialState, addIngredient(mockIngridient1));

      expect(newState.ingredients).toEqual([
        { ...mockIngridient1, id: 'ing-1' }
      ]);
      expect(newState.bun).toBeNull();
      uuidSpy.mockRestore();
    });

    test('Добавление нескольких ингредиентов  подряд', () => {
      const uuidSpy = jest
        .spyOn(globalThis.crypto, 'randomUUID')
        .mockReturnValue(
          'ing-1' as `${string}-${string}-${string}-${string}-${string}`
        );

      let newState = reducer(initialState, addIngredient(mockIngridient1));
      newState = reducer(newState, addIngredient(mockSauc));

      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients[0]._id).toBe(mockIngridient1._id);
      expect(newState.ingredients[1]._id).toBe(mockSauc._id);
      uuidSpy.mockRestore();
    });
  });

  describe('moveIngredient', () => {
    test('Передвинуть ингридиент в конструкторе', () => {
      // moveIngredient
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngridient1, mockIngridient2, mockSauc]
      };
      // снимаем лайк с помощью экшена toggleLike
      const newState = reducer(
        stateWithIngredients,
        moveIngredient({ currentIndex: 0, targetIndex: 2 })
      );

      expect(newState.ingredients).toEqual([
        mockIngridient2,
        mockSauc,
        mockIngridient1
      ]);
    });

    test('Передвинуть ингридиент в конструкторе с первого на последнее место', () => {
      // moveIngredient
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngridient1, mockIngridient2]
      };
      // снимаем лайк с помощью экшена toggleLike
      const newState = reducer(
        stateWithIngredients,
        moveIngredient({ currentIndex: 0, targetIndex: 1 })
      );

      expect(newState.ingredients).toEqual([mockIngridient2, mockIngridient1]);
    });
  });

  describe('removeIngredient', () => {
    test('Удалить ингридиент из конструктора', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngridient1, mockIngridient2]
      };

      const newState = reducer(stateWithIngredients, removeIngredient('ing-1'));

      expect(newState.ingredients).toEqual([mockIngridient2]);
    });

    test('Удалить ингридиент из конструктора, если id не найден', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngridient1]
      };

      const newState = reducer(
        stateWithIngredients,
        removeIngredient('nonexistent-id')
      );

      expect(newState.ingredients).toEqual([mockIngridient1]);
    });
  });

  describe('clearConstructor', () => {
    test('Очистить конструктор', () => {
      const filledState = {
        bun: mockBun,
        ingredients: [mockIngridient1, mockIngridient2],
        isLoading: false
      };

      const newState = reducer(filledState, clearConstructor());

      expect(newState).toEqual(initialState);
    });

    test('не падает на пустом state', () => {
      const newState = reducer(initialState, clearConstructor());

      expect(newState).toEqual(initialState);
    });
  });

  describe('селекторы', () => {
    const filledState = {
      bun: mockBun,
      ingredients: [mockIngridient1, mockIngridient2],
      isLoading: false
    };

    const rootState = { burgerConstructor: filledState };

    test('constructorItemsSelector возвращает весь state слайса', () => {
      expect(constructorItemsSelector(rootState)).toEqual(filledState);
    });

    test('bunSelector возвращает булку', () => {
      expect(bunSelector(rootState)).toBe(mockBun);
    });

    test('ingredientsSelector возвращает массив ингредиентов', () => {
      expect(ingredientsSelector(rootState)).toEqual([
        mockIngridient1,
        mockIngridient2
      ]);
    });

    test('areIngredientsLoading возвращает флаг загрузки', () => {
      expect(areIngredientsLoading(rootState)).toBe(false);
      expect(
        areIngredientsLoading({
          burgerConstructor: { ...filledState, isLoading: true }
        })
      ).toBe(true);
    });
  });

  describe('getIngredients', () => {
    afterEach(() => {
      mockedGenerateId.mockReset();
    });

    test('pending: включает loading и не затирает уже имеющиеся ingredients', () => {
      const state = reducer(
        { ...initialState, ingredients: [mockIngridient1] },
        getIngredients.pending('')
      );

      expect(state.isLoading).toBe(true);
      expect(state.ingredients).toEqual([mockIngridient1]);
    });

    test('fulfilled: сохраняет ингредиенты с id и выключает loading', () => {
      mockedGenerateId.mockReturnValueOnce('id-1').mockReturnValueOnce('id-2');

      const state = reducer(
        { ...initialState, isLoading: false },
        getIngredients.fulfilled(mockIngridients, '')
      );

      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual([
        { ...mockIngridients[0], id: 'id-1' },
        { ...mockIngridients[1], id: 'id-2' }
      ]);
    });

    test('rejected: выключает loading и не трогает ingredients', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const state = reducer(
        { ...initialState, isLoading: true },
        getIngredients.rejected(new Error(errorMessage), '')
      );

      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual([]);
    });
  });
});
