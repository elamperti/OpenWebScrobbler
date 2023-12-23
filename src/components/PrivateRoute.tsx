import { Navigate } from 'react-router-dom';
import { useUserData } from 'hooks/useUserData';

import type { FC } from 'react';

export default function PrivateRoute({ using: View }: { using: FC }) {
  const { isLoggedIn, isLoading } = useUserData();
  if (isLoggedIn) {
    return <View />;
  } else if (!isLoading) {
    return <Navigate to="/" />;
  }
}
