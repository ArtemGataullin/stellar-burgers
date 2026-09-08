import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '..//../services/store';
import {
  fetchProfileOrders,
  profileOrdersLoadingSelector,
  profileOrdersSelector
} from '../../services/slices/profile-orders-slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(profileOrdersSelector);
  const loading = useSelector(profileOrdersLoadingSelector);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (!loading) {
    <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
