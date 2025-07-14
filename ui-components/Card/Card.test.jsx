import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Contenu</Card>);
    expect(screen.getByText('Contenu')).toBeInTheDocument();
  });
});
