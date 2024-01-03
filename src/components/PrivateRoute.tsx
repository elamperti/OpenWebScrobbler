import { Navigate } from 'react-router-dom';
import { useUserData } from 'hooks/useUserData';

import type { FC } from 'react';

export default function PrivateRoute({ using: View }: { using: FC }) {
  const { isLoggedIn, isFetching } = useUserData();

  if (isFetching || isLoggedIn) {
    return <View />;
  } else {
    return <Navigate to="/" />;
  }
}
