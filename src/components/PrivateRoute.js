import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export default function PrivateRoute(props) {
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

  if (isLoggedIn) {
    return <Route {...props} />;
  } else {
    return <Redirect to="/" />;
  }
}
