import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Erreur</Alert>);
    expect(screen.getByText('Erreur')).toBeInTheDocument();
  });
});
