/**
 * 🧪 Component Tests - Context and Services
 * 
 * Tests pour vérifier le bon fonctionnement du Context et des services.
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Text, TouchableOpacity } from 'react-native';
import { AppProvider, useAppContext } from '../contexts/AppContext';

// Test component that uses the context
const TestComponent = () => {
  const { state, actions } = useAppContext();
  
  return (
    <>
      <Text testID="current-language">{state.selectedLanguage}</Text>
      <Text testID="accessibility-theme">{state.userPreferences.theme}</Text>
      <Text testID="loading-state">{state.isLoading.toString()}</Text>
      <TouchableOpacity
        testID="change-language-button"
        onPress={() => actions.setSelectedLanguage('es')}
      >
        <Text>Change Language</Text>
      </TouchableOpacity>
      <TouchableOpacity
        testID="toggle-loading-button"
        onPress={() => actions.setLoading(!state.isLoading)}
      >
        <Text>Toggle Loading</Text>
      </TouchableOpacity>
    </>
  );
};

const TestComponentWithProvider = () => (
  <AppProvider>
    <TestComponent />
  </AppProvider>
);

describe('AppContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('provides default state values', async () => {
    render(<TestComponentWithProvider />);
    
    expect(screen.getByTestId('current-language').props.children).toContain('fr');
    expect(screen.getByTestId('accessibility-theme').props.children).toContain('light');
    expect(screen.getByTestId('loading-state').props.children).toContain('false');
  });

  test('updates selected language when setSelectedLanguage is called', async () => {
    render(<TestComponentWithProvider />);
    
    const changeLanguageButton = screen.getByTestId('change-language-button');
    fireEvent.press(changeLanguageButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('current-language').props.children).toContain('es');
    });
  });

  test('toggles loading state', async () => {
    render(<TestComponentWithProvider />);
    
    const toggleLoadingButton = screen.getByTestId('toggle-loading-button');
    fireEvent.press(toggleLoadingButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('loading-state').props.children).toContain('true');
    });
  });
});

describe('Hook Tests', () => {
  test('useAppContext throws error when used outside provider', () => {
    const TestComponentWithoutProvider = () => {
      const { state } = useAppContext();
      return <Text>{state.selectedLanguage}</Text>;
    };

    // This should throw an error
    expect(() => render(<TestComponentWithoutProvider />)).toThrow();
  });
});

describe('Performance Tests', () => {
  test('components render within acceptable time', async () => {
    const startTime = performance.now();
    
    render(<TestComponentWithProvider />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render in less than 100ms
    expect(renderTime).toBeLessThan(100);
  });

  test('context updates are efficient', async () => {
    render(<TestComponentWithProvider />);
    
    const startTime = performance.now();
    
    const changeLanguageButton = screen.getByTestId('change-language-button');
    fireEvent.press(changeLanguageButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('current-language').props.children).toContain('es');
    });
    
    const endTime = performance.now();
    const updateTime = endTime - startTime;
    
    // Context updates should be fast
    expect(updateTime).toBeLessThan(50);
  });

  test('multiple rapid updates dont cause issues', async () => {
    render(<TestComponentWithProvider />);
    
    const toggleLoadingButton = screen.getByTestId('toggle-loading-button');
    
    // Rapid fire updates
    for (let i = 0; i < 10; i++) {
      fireEvent.press(toggleLoadingButton);
    }
    
    // Should still be responsive
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toBeDefined();
    });
  });
});

describe('State Management', () => {
  test('state persists between component remounts', async () => {
    const { rerender } = render(<TestComponentWithProvider />);
    
    // Change the language
    const changeLanguageButton = screen.getByTestId('change-language-button');
    fireEvent.press(changeLanguageButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('current-language').props.children).toContain('es');
    });
    
    // Remount the component
    rerender(<TestComponentWithProvider />);
    
    // Language should still be 'es' (if persistence is working)
    expect(screen.getByTestId('current-language').props.children).toContain('es');
  });

  test('error handling works correctly', async () => {
    const TestErrorComponent = () => {
      const { state, actions } = useAppContext();
      
      return (
        <>
          <Text testID="error-message">{state.error || 'no-error'}</Text>
          <TouchableOpacity
            testID="set-error-button"
            onPress={() => actions.setError('Test error message')}
          >
            <Text>Set Error</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="clear-error-button"
            onPress={() => actions.clearError()}
          >
            <Text>Clear Error</Text>
          </TouchableOpacity>
        </>
      );
    };

    const TestErrorWithProvider = () => (
      <AppProvider>
        <TestErrorComponent />
      </AppProvider>
    );

    render(<TestErrorWithProvider />);
    
    // Initially no error
    expect(screen.getByTestId('error-message').props.children).toContain('no-error');
    
    // Set an error
    fireEvent.press(screen.getByTestId('set-error-button'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message').props.children).toContain('Test error message');
    });
    
    // Clear the error
    fireEvent.press(screen.getByTestId('clear-error-button'));
    await waitFor(() => {
      expect(screen.getByTestId('error-message').props.children).toContain('no-error');
    });
  });
});
