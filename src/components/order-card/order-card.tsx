import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '..//../services/store';
import { ingredientsSelector } from '..//..//services/slices/ingredients-slice';
import { getIngredientsInfo } from '../../utils/order-helper';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredientsState = useSelector(ingredientsSelector);

  const orderInfo = useMemo(() => {
    if (!ingredientsState.length) return null;

    const { ingredientsInfo, total } = getIngredientsInfo(
      order,
      ingredientsState
    );

    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    const date = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains,
      total,
      date
    };
  }, [order, ingredientsState]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
