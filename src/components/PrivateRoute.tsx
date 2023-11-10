import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import type { FC } from 'react';
import type { RootState } from 'store';

export default function PrivateRoute({ using: View }: { using: FC }) {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  if (isLoggedIn) {
    return <View />;
  } else {
    return <Navigate to="/" />;
  }
}
