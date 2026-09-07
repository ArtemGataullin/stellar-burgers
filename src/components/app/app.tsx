import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, OrderInfo } from '@components';
import { Preloader } from '@ui';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { OrderModal } from '../order-modal/order-modal';
import { IngredientDetailsModal } from '../ingredient-details-modal/ingredient-details';
import { ProtectedRoute } from '..//..//services/ProtectedRoute';
import { RootState, useDispatch, useSelector } from '..//../services/store';
import {
  getIngredients,
  selectIngredientsLoading
} from '..//../services/ingredients-slice';
import { useEffect } from 'react';

const App = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменные из стора */
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );
  const error = useSelector((state: RootState) => state.ingredients.error);

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <div className={styles.app}>
        <AppHeader />
        {isIngredientsLoading ? (
          <Preloader />
        ) : error ? (
          <div className={`${styles.error} text text_type_main-medium pt-4`}>
            {error}
          </div>
        ) : ingredients.length > 0 ? (
          <Routes>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />

            <Route path='*' element={<NotFound404 />} />

            <Route path='/profile/orders/:number' element={<OrderModal />} />
            <Route path='/feed/:number' element={<OrderModal />} />
            <Route
              path='/ingredients/:id'
              element={<IngredientDetailsModal />}
            />
          </Routes>
        ) : (
          <div className={`${styles.title} text text_type_main-medium pt-4`}>
            Нет игредиентов
          </div>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;
