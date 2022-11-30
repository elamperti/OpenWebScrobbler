import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';
import i18n from '../utils/i18n';

describe('Footer', () => {
  beforeEach(() => {
    i18n.init();
  });

  it('should render something', () => {
    render(<Footer />);
    const heart = screen.getByText(/❤/i);
    expect(heart).toBeInTheDocument();
  });
});
