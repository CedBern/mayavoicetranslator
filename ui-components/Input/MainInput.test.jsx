import { render, screen } from '@testing-library/react';
import { MainInput } from './MainInput';

describe('MainInput', () => {
  it('renders with placeholder', () => {
    render(<MainInput placeholder="Texte" />);
    expect(screen.getByPlaceholderText('Texte')).toBeInTheDocument();
  });
  it('is accessible with aria-label', () => {
    render(<MainInput aria-label="Entrer un texte" />);
    expect(screen.getByLabelText('Entrer un texte')).toBeInTheDocument();
  });
});
