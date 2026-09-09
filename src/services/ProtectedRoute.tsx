// import { useSelector } from "react-redux";
import { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Preloader } from '@ui';
import { useSelector } from './store';
import { isAuthCheckedSelector, userSelector } from './slices/user-slice';
import { LocationState } from '@utils-types';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactNode;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const user = useSelector(userSelector);
  const location = useLocation();
  const state = location.state as LocationState;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    const from = state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};
