import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ using: View }) {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  if (isLoggedIn) {
    return <View />;
  } else {
    return <Navigate to="/" />;
  }
}

PrivateRoute.propTypes = {
  using: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
};
