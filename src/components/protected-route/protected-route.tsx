import React from 'react';
import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnauth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnauth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const user = useSelector((state) => state.user.data);
  const location = useLocation();

  if (!isAuthChecked) {
    return (
      <div>
        <Preloader />
      </div>
    );
  }

  if (onlyUnauth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  if (!onlyUnauth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  return children;
};
