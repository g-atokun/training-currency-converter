import { render, screen } from '@testing-library/react';
import PageFooter from './PageFooter';

describe('PageFooter', () => {
  it('should render exchange rate update info', () => {
    render(<PageFooter />);
    expect(screen.getByText('Exchange rates are updated hourly')).toBeInTheDocument();
  });

  it('should display last updated time when provided', () => {
    const timestamp = new Date('2024-01-15T12:00:00Z').getTime();
    render(<PageFooter lastUpdated={timestamp} />);
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });

  it('should not display last updated when not provided', () => {
    render(<PageFooter />);
    expect(screen.queryByText(/Last updated:/)).not.toBeInTheDocument();
  });

  it('should display copyright notice with current year', () => {
    render(<PageFooter />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} Example Technologies. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it('should display copyright notice with dynamic year (not hardcoded)', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2030-06-01'));

    render(<PageFooter />);

    expect(screen.getByText(/2030 Example Technologies/)).toBeInTheDocument();

    jest.useRealTimers();
  });
});
