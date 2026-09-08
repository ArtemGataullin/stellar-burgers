import { TIngredient, TOrder } from './types';

export const getIngredientsInfo = (
  order: TOrder,
  ingredientsState: TIngredient[]
) => {
  const ingredientsInfo = order.ingredients
    .map((id) => ingredientsState.find((ing) => ing._id === id))
    .filter((ing): ing is TIngredient => !!ing);

  const total = ingredientsInfo.reduce((sum, ing) => sum + ing.price, 0);

  return { ingredientsInfo, total };
};

export const getIngredientsWithCount = (
  order: TOrder,
  allIngredients: TIngredient[]
) => {
  const result: { [key: string]: TIngredient & { count: number } } = {};
  order.ingredients.forEach((id) => {
    const ingredient = allIngredients.find((ing) => ing._id === id);
    if (ingredient) {
      if (result[id]) {
        result[id].count++;
      } else {
        result[id] = { ...ingredient, count: 1 };
      }
    }
  });
  return result;
};

export const formatDate = (dateString: string) => new Date(dateString);
