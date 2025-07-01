/**
 * 🧪 SETUP TESTS
 * 
 * Configuration globale pour les tests de l'application TalkKin.
 */

// Les matchers sont désormais inclus par défaut avec @testing-library/react-native
import '@testing-library/jest-native/legacy-extend-expect';

// Mock React Native modules (sans requireActual pour éviter les imports natifs ESM problématiques)
jest.mock('react-native', () => {
  const React = require('react');
  const mkHost = (name: string) => React.forwardRef((props: any, ref: any) => React.createElement(name, { ...props, ref }, props.children));
  return {
    Platform: {
      OS: 'web',
      select: jest.fn((obj: any) => obj.web || obj.default),
    },
    Dimensions: {
      get: jest.fn(() => ({ width: 375, height: 812 })),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    StyleSheet: { create: jest.fn((styles: any) => styles) },
    ActivityIndicator: jest.fn(() => null),
    View: mkHost('View'),
    Text: mkHost('Text'),
    TextInput: mkHost('TextInput'),
    ScrollView: mkHost('ScrollView'),
    TouchableOpacity: mkHost('TouchableOpacity'),
    Pressable: mkHost('Pressable'),
    SafeAreaView: mkHost('SafeAreaView'),
    FlatList: mkHost('FlatList'),
    SectionList: mkHost('SectionList'),
    Image: mkHost('Image'),
    Button: mkHost('Button'),
    Switch: mkHost('Switch'),
    Modal: mkHost('Modal'),
    ActivityIndicatorIOS: mkHost('ActivityIndicatorIOS'),
    KeyboardAvoidingView: mkHost('KeyboardAvoidingView'),
    RefreshControl: mkHost('RefreshControl'),
    TouchableHighlight: mkHost('TouchableHighlight'),
    TouchableWithoutFeedback: mkHost('TouchableWithoutFeedback'),
    Animated: {
      View: mkHost('Animated.View'),
      Text: mkHost('Animated.Text'),
      // Ajoutez d'autres Animated si besoin
    },
    // Ajoutez ici d'autres mocks nécessaires pour vos tests
  };
});

// Mock Expo modules
jest.mock('expo-constants', () => ({
  ExecutionEnvironment: {
    StoreKit: 'StoreKit',
  },
  expoConfig: {
    name: 'TalkKin Test',
    version: '1.0.0',
  },
}));

jest.mock('expo-localization', () => ({
  locale: 'fr-FR',
  locales: ['fr-FR'],
  timezone: 'Europe/Paris',
  isoCurrencyCodes: ['EUR'],
  region: 'FR',
  isRTL: false,
}));

// Mock AsyncStorage complet avec getAllKeys et autres méthodes attendues
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useRoute: () => ({
    params: {},
  }),
  useFocusEffect: jest.fn(),
  NavigationContainer: ({ children }: any) => children,
}));

// Mock TTS service
jest.mock('../services/IndigenousTTSService', () => ({
  initialize: jest.fn(() => Promise.resolve(true)),
  speak: jest.fn(() => Promise.resolve()),
  stop: jest.fn(),
  isReady: jest.fn(() => true),
}));

// Mock Speech Recognition service
jest.mock('../services/NativeSpeechRecognitionWebService', () => ({
  initialize: jest.fn(() => Promise.resolve(true)),
  startListening: jest.fn(),
  stopListening: jest.fn(),
  setCallbacks: jest.fn(),
  isSupported: jest.fn(() => true),
}));

// Mock API calls
const mockApiRouter = (url: string, options: any = {}) => {
  // /api/status
  if (url.includes('/api/status')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        status: 'ok',
        version: 'test-version',
        uptime: 12345,
        timestamp: Date.now(),
      }),
    });
  }
  // /api/usage/paid
  if (url.includes('/api/usage/paid')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: true,
        total: 0,
        usage: [],
        summary: {},
      }),
    });
  }
  // /api/suggestions
  if (url.includes('/api/suggestions')) {
    if (!options.headers || !options.headers['Authorization']) {
      return Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      });
    }
    const urlObj = new URL(url, 'http://localhost');
    const text = urlObj.searchParams.get('text') || '';
    if (text.length < 3) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          success: true,
          suggestions: ['Entrée incomplète, veuillez préciser', 'Exemple de suggestion'],
        }),
      });
    }
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: true,
        suggestions: ['Suggestion 1', 'Suggestion 2'],
      }),
    });
  }
  // /api/translate
  if (url.includes('/api/translate')) {
    if (options && options.body) {
      const body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      if (!body || !body.text) {
        return Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ error: 'Missing text param' }),
        });
      }
      if (!options.headers || !options.headers['Authorization']) {
        return Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: 'Unauthorized' }),
        });
      }
      if (body.text.length < 3) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ success: false, message: 'Texte trop court ou ambigu' }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true, translation: `Traduction mockée de: ${body.text}` }),
      });
    }
    return Promise.resolve({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: 'Missing body' }),
    });
  }
  // /api/payment/intent
  if (url.includes('/api/payment/intent')) {
    return Promise.resolve({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ clientSecret: 'mocked_secret', status: 'requires_action' }),
    });
  }
  // Fallback générique
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ success: true, message: 'Mocked API response' }),
  });
};
global.fetch = jest.fn((url: string, options?: any) => mockApiRouter(url, options)) as jest.Mock;

// Console warnings suppression for tests
const originalWarn = console.warn;
console.warn = (...args) => {
  // Ignore specific warnings that are expected in tests
  const warningsToIgnore = [
    'Warning: React.createElement: type is invalid',
    'Warning: Failed prop type',
    'VirtualizedLists should never be nested',
  ];
  
  const message = args.join(' ');
  if (warningsToIgnore.some(warning => message.includes(warning))) {
    return;
  }
  
  originalWarn(...args);
};

// Declare global testUtils type
declare global {
  var testUtils: {
    mockTimers: () => void;
    restoreTimers: () => void;
    waitFor: (callback: () => void, timeout?: number) => Promise<boolean>;
    createMockProps: (overrides?: any) => any;
  };
}

// Global test utilities
global.testUtils = {
  // Mock timers
  mockTimers: () => {
    jest.useFakeTimers();
  },
  
  // Restore timers
  restoreTimers: () => {
    jest.useRealTimers();
  },
  
  // Wait for async operations
  waitFor: (callback: () => void, timeout: number = 1000) => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const check = () => {
        try {
          callback();
          resolve(true);
        } catch (error) {
          if (Date.now() - startTime > timeout) {
            throw error;
          }
          setTimeout(check, 10);
        }
      };
      check();
    });
  },
  
  // Create mock component props
  createMockProps: (overrides = {}) => ({
    onNavigate: jest.fn(),
    accessibilityTheme: 'light',
    ...overrides,
  }),
};

// Setup cleanup
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// Performance monitoring for tests
const originalPerformanceNow = performance.now;
let testStartTime: number;

beforeEach(() => {
  testStartTime = originalPerformanceNow.call(performance);
});

afterEach(() => {
  const testDuration = originalPerformanceNow.call(performance) - testStartTime;
  if (testDuration > 100) {
    console.warn(`⚠️ Slow test detected: ${testDuration.toFixed(2)}ms`);
  }
});

// Force NativeDeviceInfo mocks pour tous les chemins sauf /index.js (qui n'existe pas physiquement)
jest.mock('react-native/Libraries/Utilities/NativeDeviceInfo', () => ({
  __esModule: true,
  default: {
    getConstants: () => ({
      Dimensions: {
        window: { width: 375, height: 667, scale: 2, fontScale: 2 },
        screen: { width: 375, height: 667, scale: 2, fontScale: 2 },
      },
      isTesting: true,
    }),
  },
  getConstants: () => ({
    Dimensions: {
      window: { width: 375, height: 667, scale: 2, fontScale: 2 },
      screen: { width: 375, height: 667, scale: 2, fontScale: 2 },
    },
    isTesting: true,
  }),
}));
jest.mock('react-native/Libraries/Utilities/NativeDeviceInfo.js', () => ({
  __esModule: true,
  default: {
    getConstants: () => ({
      Dimensions: {
        window: { width: 375, height: 667, scale: 2, fontScale: 2 },
        screen: { width: 375, height: 667, scale: 2, fontScale: 2 },
      },
      isTesting: true,
    }),
  },
  getConstants: () => ({
    Dimensions: {
      window: { width: 375, height: 667, scale: 2, fontScale: 2 },
      screen: { width: 375, height: 667, scale: 2, fontScale: 2 },
    },
    isTesting: true,
  }),
}));

export { };

// Type declarations for global utilities
declare global {
  namespace NodeJS {
    interface Global {
      testUtils: {
        mockTimers: () => void;
        restoreTimers: () => void;
        waitFor: (callback: () => void, timeout?: number) => Promise<boolean>;
        createMockProps: (overrides?: any) => any;
      };
    }
  }
}