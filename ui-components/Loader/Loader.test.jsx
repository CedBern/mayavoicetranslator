import { render } from '@testing-library/react';
import { Loader } from './Loader';

describe('Loader', () => {
  it('renders without crashing', () => {
    render(<Loader aria-label="Chargement" />);
  });
});
