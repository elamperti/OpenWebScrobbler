import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorPage from './ErrorPage';
import sentry from '@sentry/react';

jest.mock('@sentry/react', () => {
  const originalModule = jest.requireActual('@sentry/react');

  return {
    ...originalModule,
    showReportDialog: jest.fn(),
  };
});

describe('ErrorPage', () => {
  it('should render correctly', () => {
    render(<ErrorPage />);

    const title = screen.getByText(/Sorry, there was a problem/);
    expect(title).toBeInTheDocument();
  });

  it('should display the error', () => {
    render(<ErrorPage error={12345} />);

    const title = screen.getByText(/12345/);
    expect(title).toBeInTheDocument();
  });

  it('should have working buttons', () => {
    const returnFn = jest.fn();
    render(<ErrorPage resetError={returnFn} />);

    const reportButton = screen.getByText(/Tell us what happened/);
    fireEvent.click(reportButton);
    expect(sentry.showReportDialog).toHaveBeenCalled();

    const returnButton = screen.getByText(/Return to the scrobbler/);
    fireEvent.click(returnButton);
    expect(returnFn).toHaveBeenCalled();
  });

  it('should be able to reload the page', () => {
    const originalLocation = window.location;
    delete window.location;
    window.location = { reload: jest.fn() } as unknown as Location;

    render(<ErrorPage />);

    const refreshButton = screen.getByText(/please refresh the page/i);
    fireEvent.click(refreshButton);
    expect(window.location.reload).toHaveBeenCalled();

    window.location = originalLocation;
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Do we need this here?
  });
});
