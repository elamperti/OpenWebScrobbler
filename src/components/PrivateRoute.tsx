import type { FC } from 'react';

import { useUserData } from 'hooks/useUserData';
import { Navigate } from 'react-router-dom';


export default function PrivateRoute({ using: View }: { using: FC }) {
  const { isLoggedIn, isFetching } = useUserData();

  if (isFetching || isLoggedIn) {
    return <View />;
  } else {
    return <Navigate to="/" />;
  }
}
