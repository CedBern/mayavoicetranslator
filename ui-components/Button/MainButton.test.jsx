import { render, screen } from '@testing-library/react';
import { MainButton } from './MainButton';

describe('MainButton', () => {
  it('renders with children', () => {
    render(<MainButton>Test</MainButton>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
  it('is accessible with aria-label', () => {
    render(<MainButton aria-label="Traduire">Traduire</MainButton>);
    expect(screen.getByLabelText('Traduire')).toBeInTheDocument();
  });
});
