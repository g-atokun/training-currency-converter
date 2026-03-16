import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RefreshButton from './RefreshButton';

describe('RefreshButton', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render a button accessible as "Refresh rates"', () => {
    render(<RefreshButton onClick={jest.fn()} loading={false} />);
    expect(screen.getByRole('button', { name: /refresh rates/i })).toBeInTheDocument();
  });

  it('should call onClick when clicked in idle state', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onClick = jest.fn();

    render(<RefreshButton onClick={onClick} loading={false} />);
    await user.click(screen.getByRole('button', { name: /refresh rates/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when loading is true', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onClick = jest.fn();

    render(<RefreshButton onClick={onClick} loading={true} />);

    const button = screen.getByRole('button', { name: /refresh rates/i });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should be disabled during 1-second cooldown after click', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onClick = jest.fn();

    render(<RefreshButton onClick={onClick} loading={false} />);
    const button = screen.getByRole('button', { name: /refresh rates/i });

    await user.click(button);

    expect(button).toBeDisabled();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(button).not.toBeDisabled();
  });

  it('should show animate-spin class when loading is true', () => {
    render(<RefreshButton onClick={jest.fn()} loading={true} />);

    const svg = screen.getByRole('button', { name: /refresh rates/i }).querySelector('svg');
    expect(svg).toHaveClass('animate-spin');
  });

  it('should not show animate-spin class when loading is false', () => {
    render(<RefreshButton onClick={jest.fn()} loading={false} />);

    const svg = screen.getByRole('button', { name: /refresh rates/i }).querySelector('svg');
    expect(svg).not.toHaveClass('animate-spin');
  });

  it('should have correct aria-label and title attributes', () => {
    render(<RefreshButton onClick={jest.fn()} loading={false} />);

    const button = screen.getByRole('button', { name: /refresh rates/i });
    expect(button).toHaveAttribute('aria-label', 'Refresh rates');
    expect(button).toHaveAttribute('title', 'Refresh rates');
  });
});
