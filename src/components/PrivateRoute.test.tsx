import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { useUserData } from 'hooks/useUserData';

import PrivateRoute from './PrivateRoute';

import type { Mock } from 'vitest';

vi.mock('hooks/useUserData');

const MockView = () => <div>Mock View</div>;

describe('PrivateRoute', () => {
  it('renders the private route', () => {
    (useUserData as Mock).mockReturnValue({
      isFetching: true,
      isLoggedIn: false,
    });

    render(
      <MemoryRouter>
        <PrivateRoute using={MockView} />
      </MemoryRouter>
    );
    expect(screen.getByText('Mock View')).toBeInTheDocument();
  });

  it('redirects home if user is not logged in', () => {
    (useUserData as Mock).mockReturnValue({
      isFetching: false,
      isLoggedIn: false,
    });

    render(
      <MemoryRouter>
        <PrivateRoute using={MockView} />
      </MemoryRouter>
    );
    expect(screen.queryByText('Mock View')).toBeNull();
  });
});
