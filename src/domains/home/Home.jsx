import { useEffect } from 'react';

import { useUserData } from 'hooks/useUserData';

import HomeUser from 'domains/home/HomeUser';
import HomeVisitor from 'domains/home/HomeVisitor';

import './Home.scss';

const bodyDecoration = 'with-shadow';

export default function Home() {
  const { isLoggedIn } = useUserData();

  useEffect(() => {
    // Add body class for special home background
    // ToDo: get rid of this unholy hack
    document.body.classList.add(bodyDecoration);

    return () => {
      // unmount
      document.body.classList.remove(bodyDecoration);
    };
  });

  return isLoggedIn ? <HomeUser /> : <HomeVisitor />;
}
