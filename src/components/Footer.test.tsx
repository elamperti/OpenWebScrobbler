import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import i18n from '../utils/i18n';

const returnedLocation = {
  pathName: '',
};

vi.mock('react-router-dom', async() => ({
  ...(await vi.importActual('react-router-dom')),
  useLocation: () => returnedLocation,
}));

describe('Footer', () => {
  beforeEach(() => {
    i18n.init();
    returnedLocation.pathName = '';
  });

  it('should render', () => {
    render(<Footer />);
    const heart = screen.getByText(/❤/i);
    expect(heart).toBeInTheDocument();
  });

  it('should not ask for support in the homepage', () => {
    returnedLocation.pathName = '/';
    render(<Footer />);

    const supportMessage = screen.queryByText(/support this project/i);
    expect(supportMessage).toBeInTheDocument();
  });

  it('should ask for support in other views', () => {
    returnedLocation.pathName = '/scrobble/song';
    render(<Footer />);

    const supportMessage = screen.queryByText(/support this project/i);
    expect(supportMessage).toBeInTheDocument();
  });
});
