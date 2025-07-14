/**
 * 🔄 SERVICE DE GESTION D'ÉTAT TALKKIN - REDUX-LIKE
 * 
 * Fonctionnalités :
 * - Actions typées
 * - Reducers optimisés
 * - Middleware support
 * - DevTools integration
 * - Persistence automatique
 * - Performance monitoring
 */

import CacheService from './CacheService';

// Types d'actions
export type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_USER'; payload: any }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'SET_SELECTED_LANGUAGE'; payload: string }
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'ADD_TRANSLATION'; payload: Translation }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<UserProgress> }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'SET_NETWORK_STATUS'; payload: 'online' | 'offline' }
  | { type: 'UPDATE_CACHE'; payload: any }
  | { type: 'CLEAR_CACHE' }
  | { type: 'SET_PERFORMANCE_METRICS'; payload: Partial<PerformanceMetrics> };

// Types de données
export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoPlay: boolean;
  voiceSpeed: number;
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    largeButtons: boolean;
    simpleInterface: boolean;
  };
}

export interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  timestamp: number;
  confidence: number;
  audioUrl?: string;
}

export interface UserProgress {
  level: number;
  wordsLearned: number;
  streak: number;
  totalSessions: number;
  achievements: Achievement[];
  weeklyGoal: number;
  dailyGoal: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface PerformanceMetrics {
  memoryUsage: number;
  renderTime: number;
  frameRate: number;
  bundleSize: number;
  loadTime: number;
  apiResponseTime: number;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  speakers: string;
  status: 'stable' | 'beta' | 'alpha';
  regions: string[];
  dialects?: string[];
}

// État de l'application
export interface AppState {
  // Utilisateur
  user: any | null;
  isAuthenticated: boolean;
  userPreferences: UserPreferences;
  
  // État de l'app
  isLoading: boolean;
  error: string | null;
  networkStatus: 'online' | 'offline';
  
  // Langues et traduction
  selectedLanguage: string;
  availableLanguages: Language[];
  
  // Progression utilisateur
  userProgress: UserProgress;
  
  // Historique
  translationHistory: Translation[];
  
  // Cache et performance
  cache: {
    translations: Record<string, Translation>;
    audio: Record<string, string>;
    lastUpdated: number | null;
  };
  performanceMetrics: PerformanceMetrics;
  
  // État de l'interface
  isConnected?: boolean;
  currentPage: string;
  accessibilityProfile: any | null;
}

// État initial
export const INITIAL_STATE: AppState = {
  // Utilisateur
  user: null,
  isAuthenticated: false,
  userPreferences: {
    language: 'fr',
    theme: 'light',
    notifications: true,
    autoPlay: true,
    voiceSpeed: 1.0,
    accessibility: {
      highContrast: false,
      largeText: false,
      largeButtons: false,
      simpleInterface: false,
    },
  },
  
  // État de l'app
  isLoading: false,
  error: null,
  networkStatus: 'online',
  
  // Langues
  selectedLanguage: 'maya',
  availableLanguages: [
    { 
      code: 'maya', 
      name: 'Maya (K\'iche\')', 
      flag: '🏛️', 
      speakers: '6M', 
      status: 'stable',
      regions: ['Guatemala', 'Mexique'],
      dialects: ['K\'iche\'', 'Q\'eqchi\'', 'Kaqchikel']
    },
    { 
      code: 'quechua', 
      name: 'Quechua', 
      flag: '🏔️', 
      speakers: '8M', 
      status: 'stable',
      regions: ['Pérou', 'Bolivie', 'Équateur'],
      dialects: ['Quechua du Sud', 'Quechua du Nord']
    },
    { 
      code: 'guarani', 
      name: 'Guaraní', 
      flag: '🌿', 
      speakers: '5M', 
      status: 'beta',
      regions: ['Paraguay', 'Argentine', 'Brésil']
    },
    { 
      code: 'nahuatl', 
      name: 'Nahuatl', 
      flag: '🌋', 
      speakers: '2M', 
      status: 'alpha',
      regions: ['Mexique']
    },
  ],
  
  // Progression
  userProgress: {
    level: 1,
    wordsLearned: 0,
    streak: 0,
    totalSessions: 0,
    achievements: [],
    weeklyGoal: 50,
    dailyGoal: 10,
  },
  
  // Historique
  translationHistory: [],
  
  // Cache
  cache: {
    translations: {},
    audio: {},
    lastUpdated: null,
  },
  
  // Performance
  performanceMetrics: {
    memoryUsage: 0,
    renderTime: 0,
    frameRate: 60,
    bundleSize: 0,
    loadTime: 0,
    apiResponseTime: 0,
  },
  
  // Interface
  currentPage: 'home',
  accessibilityProfile: null,
};

// Reducer principal
export function appReducer(state: AppState, action: AppAction): AppState {
  const startTime = performance.now();
  
  let newState: AppState;
  
  switch (action.type) {
    case 'SET_LOADING':
      newState = { ...state, isLoading: action.payload };
      break;
      
    case 'SET_ERROR':
      newState = { ...state, error: action.payload, isLoading: false };
      break;
      
    case 'CLEAR_ERROR':
      newState = { ...state, error: null };
      break;
      
    case 'SET_USER':
      newState = { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload 
      };
      break;
      
    case 'LOGOUT':
      newState = { 
        ...state, 
        user: null, 
        isAuthenticated: false,
        userProgress: INITIAL_STATE.userProgress,
        translationHistory: []
      };
      break;
      
    case 'UPDATE_PREFERENCES':
      newState = {
        ...state,
        userPreferences: { ...state.userPreferences, ...action.payload }
      };
      break;
      
    case 'SET_SELECTED_LANGUAGE':
      newState = { ...state, selectedLanguage: action.payload };
      break;
      
    case 'SET_CURRENT_PAGE':
      newState = { ...state, currentPage: action.payload };
      break;
      
    case 'ADD_TRANSLATION':
      newState = {
        ...state,
        translationHistory: [
          action.payload, 
          ...state.translationHistory.slice(0, 49) // Garder les 50 dernières
        ]
      };
      break;
      
    case 'CLEAR_HISTORY':
      newState = { ...state, translationHistory: [] };
      break;
      
    case 'UPDATE_PROGRESS':
      newState = {
        ...state,
        userProgress: { ...state.userProgress, ...action.payload }
      };
      break;
      
    case 'ADD_ACHIEVEMENT':
      newState = {
        ...state,
        userProgress: {
          ...state.userProgress,
          achievements: [...state.userProgress.achievements, action.payload]
        }
      };
      break;
      
    case 'SET_NETWORK_STATUS':
      newState = { ...state, networkStatus: action.payload };
      break;
      
    case 'UPDATE_CACHE':
      newState = {
        ...state,
        cache: { ...state.cache, ...action.payload, lastUpdated: Date.now() }
      };
      break;
      
    case 'CLEAR_CACHE':
      newState = { ...state, cache: INITIAL_STATE.cache };
      break;
      
    case 'SET_PERFORMANCE_METRICS':
      newState = {
        ...state,
        performanceMetrics: { ...state.performanceMetrics, ...action.payload }
      };
      break;
      
    default:
      newState = state;
  }
  
  // Mesurer le temps de traitement du reducer
  const endTime = performance.now();
  const processingTime = endTime - startTime;
  
  if (processingTime > 5) {
    console.warn(`⚠️ Reducer lent (${processingTime.toFixed(2)}ms):`, action.type);
  }
  
  return newState;
}

// Actions créateurs (action creators)
export const actions = {
  setLoading: (loading: boolean): AppAction => ({
    type: 'SET_LOADING',
    payload: loading,
  }),
  
  setError: (error: string | null): AppAction => ({
    type: 'SET_ERROR',
    payload: error,
  }),
  
  clearError: (): AppAction => ({
    type: 'CLEAR_ERROR',
  }),
  
  setUser: (user: any): AppAction => ({
    type: 'SET_USER',
    payload: user,
  }),
  
  logout: (): AppAction => ({
    type: 'LOGOUT',
  }),
  
  updatePreferences: (preferences: Partial<UserPreferences>): AppAction => ({
    type: 'UPDATE_PREFERENCES',
    payload: preferences,
  }),
  
  setSelectedLanguage: (language: string): AppAction => ({
    type: 'SET_SELECTED_LANGUAGE',
    payload: language,
  }),
  
  setCurrentPage: (page: string): AppAction => ({
    type: 'SET_CURRENT_PAGE',
    payload: page,
  }),
  
  addTranslation: (translation: Translation): AppAction => ({
    type: 'ADD_TRANSLATION',
    payload: translation,
  }),
  
  clearHistory: (): AppAction => ({
    type: 'CLEAR_HISTORY',
  }),
  
  updateProgress: (progress: Partial<UserProgress>): AppAction => ({
    type: 'UPDATE_PROGRESS',
    payload: progress,
  }),
  
  addAchievement: (achievement: Achievement): AppAction => ({
    type: 'ADD_ACHIEVEMENT',
    payload: achievement,
  }),
  
  setNetworkStatus: (status: 'online' | 'offline'): AppAction => ({
    type: 'SET_NETWORK_STATUS',
    payload: status,
  }),
  
  updateCache: (cache: any): AppAction => ({
    type: 'UPDATE_CACHE',
    payload: cache,
  }),
  
  clearCache: (): AppAction => ({
    type: 'CLEAR_CACHE',
  }),
  
  setPerformanceMetrics: (metrics: Partial<PerformanceMetrics>): AppAction => ({
    type: 'SET_PERFORMANCE_METRICS',
    payload: metrics,
  }),
};

// Middleware pour la persistence
export function persistenceMiddleware(state: AppState, action: AppAction): void {
  // Sauvegarder certaines parties de l'état
  const stateToPersist = {
    userPreferences: state.userPreferences,
    selectedLanguage: state.selectedLanguage,
    userProgress: state.userProgress,
    translationHistory: state.translationHistory.slice(0, 20), // Garder seulement 20
  };
  
  CacheService.set('app_state', stateToPersist, { ttl: 24 * 60 * 60 * 1000 }); // 24h
}

// Charger l'état depuis la persistence
export async function loadPersistedState(): Promise<Partial<AppState> | null> {
  try {
    const persisted = await CacheService.get<Partial<AppState>>('app_state');
    return persisted;
  } catch (error) {
    console.warn('⚠️ Erreur chargement état persisté:', error);
    return null;
  }
}
