import { render } from '@testing-library/react';
import { MayaGlyphIcon } from './MayaGlyphIcon';

describe('MayaGlyphIcon', () => {
  it('renders without crashing', () => {
    render(<MayaGlyphIcon />);
  });
  it('accepts color and size props', () => {
    const { container } = render(<MayaGlyphIcon color="#B86B3B" size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });
});
