import { fireEvent, render, screen } from '@testing-library/react';
import { showReportDialog } from '@sentry/react';

import ErrorPage from './ErrorPage';

vi.mock('@sentry/react', () => ({
  showReportDialog: vi.fn(),
}));

describe('ErrorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ErrorPage />);

    const title = screen.getByText(/Sorry, there was a problem/);
    expect(title).toBeInTheDocument();
  });

  it('displays the error', () => {
    render(<ErrorPage error={12345} />);

    const title = screen.getByText(/12345/);
    expect(title).toBeInTheDocument();
  });

  it('has working buttons', () => {
    const returnFn = vi.fn();

    render(<ErrorPage resetError={returnFn} />);

    const reportButton = screen.getByText(/Tell us what happened/);
    fireEvent.click(reportButton);
    expect(showReportDialog).toHaveBeenCalled();

    const returnButton = screen.getByText(/Return to the scrobbler/);
    fireEvent.click(returnButton);
    expect(returnFn).toHaveBeenCalled();
  });

  it('reloads the page when the refresh button is clicked', () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { reload: vi.fn() } as any;

    render(<ErrorPage />);

    const refreshButton = screen.getByText(/please refresh the page/i);
    fireEvent.click(refreshButton);
    expect(window.location.reload).toHaveBeenCalled();

    window.location = originalLocation as any;
  });
});
