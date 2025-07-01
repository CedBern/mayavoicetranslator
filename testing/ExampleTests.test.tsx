/**
 * 🧪 EXAMPLE COMPONENT TESTS
 * 
 * Tests d'exemple pour démontrer les bonnes pratiques
 * de test dans l'application TalkKin.
 */

import React from 'react';
import { render, fireEvent, waitFor, renderHook } from '@testing-library/react-native';
import NavigationBar from '../components/NavigationBar';
import { useAppContext } from '../contexts/AppContext';

// Mock the context
jest.mock('../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

const mockUseAppContext = useAppContext as jest.MockedFunction<typeof useAppContext>;

describe('NavigationBar', () => {
  const mockProps = {
    currentPage: 'home',
    onNavigate: jest.fn(),
    onPageChange: jest.fn(),
    isTablet: false,
  };

  beforeEach(() => {
    mockUseAppContext.mockReturnValue({
      state: {
        currentPage: 'home',
        isLoading: false,
        user: null,
      },
      actions: {
        setCurrentPage: jest.fn(),
        setLoading: jest.fn(),
      },
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<NavigationBar {...mockProps} />);
    expect(getByText('Accueil')).toBeTruthy();
  });

  it('calls onNavigate when home button is pressed', () => {
    const { getByText } = render(<NavigationBar {...mockProps} />);
    const homeButton = getByText('Accueil');
    
    fireEvent.press(homeButton);
    expect(mockProps.onNavigate).toHaveBeenCalledWith('home');
  });

  it('highlights current page button', () => {
    const { getByTestId } = render(
      <NavigationBar {...mockProps} currentPage="translator" />
    );
    
    const translatorButton = getByTestId('nav-translator');
    expect(translatorButton.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );
  });

  it('adapts layout for tablet', () => {
    const { getByTestId } = render(
      <NavigationBar {...mockProps} isTablet={true} />
    );
    
    const container = getByTestId('navigation-container');
    expect(container.props.style).toContainEqual(
      expect.objectContaining({ flexDirection: 'row' })
    );
  });
});

// Example hook test
describe('useResponsive', () => {
  const mockDimensions = {
    get: jest.fn(() => ({ width: 768, height: 1024 })),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };

  beforeEach(() => {
    jest.doMock('react-native/Libraries/Utilities/Dimensions', () => mockDimensions);
  });

  it('detects tablet breakpoint correctly', async () => {
    const { useResponsive } = await import('../hooks');
    const { result } = renderHook(() => useResponsive());

    expect(result.current.breakpoints.isTablet).toBe(true);
    expect(result.current.breakpoints.isSmall).toBe(false);
  });

  it('updates dimensions on resize', async () => {
    const { useResponsive } = await import('../hooks');
    const { result } = renderHook(() => useResponsive());

    // Simulate dimension change
    mockDimensions.get.mockReturnValue({ width: 400, height: 800 });
    
    // Trigger the event listener
    const eventListener = mockDimensions.addEventListener.mock.calls[0][1];
    eventListener({ window: { width: 400, height: 800 } });

    await waitFor(() => {
      expect(result.current.dimensions.width).toBe(400);
      expect(result.current.breakpoints.isSmall).toBe(true);
    });
  });
});

// Example integration test
describe('Translation Flow', () => {
  it('completes full translation workflow', async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          success: true,
          translation: 'Bonjour en Maya',
        }),
      })
    );
    global.fetch = mockFetch as any;

    const TranslatorPage = (await import('../components/TranslatorPage')).default;
    const { getByPlaceholderText, getByText, getByTestId } = render(
      <TranslatorPage onNavigate={jest.fn()} />
    );

    // Enter text to translate
    const textInput = getByPlaceholderText('Tapez votre texte...');
    fireEvent.changeText(textInput, 'Bonjour');

    // Select languages
    const fromLanguage = getByTestId('from-language-fr');
    const toLanguage = getByTestId('to-language-yua');
    fireEvent.press(fromLanguage);
    fireEvent.press(toLanguage);

    // Trigger translation
    const translateButton = getByText('Traduire');
    fireEvent.press(translateButton);

    // Wait for translation result
    await waitFor(() => {
      expect(getByText('Bonjour en Maya')).toBeTruthy();
    });

    // Verify API was called
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/translate',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          text: 'Bonjour',
          from: 'fr',
          to: 'yua',
        }),
      })
    );
  });
});

// Example performance test
describe('Performance Tests', () => {
  it('renders HomePage within performance budget', async () => {
    const startTime = performance.now();
    
    const HomePage = (await import('../components/HomePage_fixed')).default;
    const { render } = await import('@testing-library/react-native');
    
    render(<HomePage onNavigate={jest.fn()} accessibilityTheme={{
      isDarkTheme: false,
      needsLargeText: false,
      needsLargeButtons: false,
      needsSimpleInterface: false
    }} />);
    
    const renderTime = performance.now() - startTime;
    expect(renderTime).toBeLessThan(100); // Should render in less than 100ms
  });

  it('lazy loads components efficiently', async () => {
    const { LazyComponents } = await import('../utils/LazyComponents');
    
    const startTime = performance.now();
    const LazyTranslator = LazyComponents.TranslatorPage;
    
    // Render lazy component
    render(<LazyTranslator onNavigate={jest.fn()} />);
    
    const loadTime = performance.now() - startTime;
    expect(loadTime).toBeLessThan(200); // Lazy loading should be fast
  });
});

// Example accessibility test
describe('Accessibility Tests', () => {
  const mockProps = {
    currentPage: 'home',
    onNavigate: jest.fn(),
    onPageChange: jest.fn(),
    isTablet: false,
  };

  it('has proper accessibility labels', () => {
    const { getByLabelText } = render(
      <NavigationBar {...mockProps} />
    );

    expect(getByLabelText('Naviguer vers l\'accueil')).toBeTruthy();
    expect(getByLabelText('Ouvrir le traducteur')).toBeTruthy();
  });

  it('supports keyboard navigation', () => {
    const { getByText } = render(<NavigationBar {...mockProps} />);
    const homeButton = getByText('Accueil');

    expect(homeButton.props.accessible).toBe(true);
    expect(homeButton.props.accessibilityRole).toBe('button');
  });
});

export {};
