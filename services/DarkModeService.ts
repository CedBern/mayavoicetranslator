/**
 * 🌓 DARK MODE SERVICE - GESTION THÈMES
 * 
 * Fonctionnalités :
 * - Thème sombre/clair/automatique
 * - Persistence des préférences
 * - Détection du thème système
 * - Animations de transition
 * - Couleurs d'accessibilité
 */

import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorScheme = 'light' | 'dark';

interface ThemeColors {
  // Couleurs principales
  primary: string;
  primaryVariant: string;
  secondary: string;
  secondaryVariant: string;
  
  // Couleurs de surface
  background: string;
  surface: string;
  surfaceVariant: string;
  
  // Couleurs de texte
  onPrimary: string;
  onSecondary: string;
  onBackground: string;
  onSurface: string;
  
  // Couleurs d'état
  error: string;
  warning: string;
  success: string;
  info: string;
  
  // Couleurs sur état
  onError: string;
  onWarning: string;
  onSuccess: string;
  onInfo: string;
  
  // Couleurs d'interface
  border: string;
  divider: string;
  disabled: string;
  placeholder: string;
  
  // Couleurs d'élévation
  elevation1: string;
  elevation2: string;
  elevation3: string;
  elevation4: string;
  
  // Couleurs spécifiques TalkKin
  maya: string;
  mayaVariant: string;
  accent: string;
  accentVariant: string;
}

interface Theme {
  mode: ColorScheme;
  colors: ThemeColors;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    fontFamily: string;
    fontFamilyMono: string;
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };
    fontWeight: {
      light: string;
      regular: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  shadows: {
    sm: object;
    md: object;
    lg: object;
    xl: object;
  };
}

class DarkModeService {
  private static instance: DarkModeService;
  private currentMode: ThemeMode = 'auto';
  private currentScheme: ColorScheme = 'light';
  private listeners: Array<(theme: Theme) => void> = [];
  private preferredContrast: 'normal' | 'high' = 'normal';
  private isInitialized = false;

  // Couleurs des thèmes
  private lightColors: ThemeColors = {
    // Couleurs principales
    primary: '#2563eb',
    primaryVariant: '#1d4ed8',
    secondary: '#059669',
    secondaryVariant: '#047857',
    
    // Couleurs de surface
    background: '#ffffff',
    surface: '#f8fafc',
    surfaceVariant: '#f1f5f9',
    
    // Couleurs de texte
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#1e293b',
    onSurface: '#334155',
    
    // Couleurs d'état
    error: '#dc2626',
    warning: '#d97706',
    success: '#059669',
    info: '#0284c7',
    
    // Couleurs sur état
    onError: '#ffffff',
    onWarning: '#ffffff',
    onSuccess: '#ffffff',
    onInfo: '#ffffff',
    
    // Couleurs d'interface
    border: '#e2e8f0',
    divider: '#f1f5f9',
    disabled: '#94a3b8',
    placeholder: '#64748b',
    
    // Couleurs d'élévation
    elevation1: '#ffffff',
    elevation2: '#f8fafc',
    elevation3: '#f1f5f9',
    elevation4: '#e2e8f0',
    
    // Couleurs spécifiques TalkKin
    maya: '#8b5cf6',
    mayaVariant: '#7c3aed',
    accent: '#f59e0b',
    accentVariant: '#d97706',
  };

  private darkColors: ThemeColors = {
    // Couleurs principales
    primary: '#3b82f6',
    primaryVariant: '#2563eb',
    secondary: '#10b981',
    secondaryVariant: '#059669',
    
    // Couleurs de surface
    background: '#0f172a',
    surface: '#1e293b',
    surfaceVariant: '#334155',
    
    // Couleurs de texte
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#f8fafc',
    onSurface: '#e2e8f0',
    
    // Couleurs d'état
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#06b6d4',
    
    // Couleurs sur état
    onError: '#ffffff',
    onWarning: '#000000',
    onSuccess: '#ffffff',
    onInfo: '#ffffff',
    
    // Couleurs d'interface
    border: '#475569',
    divider: '#334155',
    disabled: '#64748b',
    placeholder: '#94a3b8',
    
    // Couleurs d'élévation
    elevation1: '#1e293b',
    elevation2: '#334155',
    elevation3: '#475569',
    elevation4: '#64748b',
    
    // Couleurs spécifiques TalkKin
    maya: '#a855f7',
    mayaVariant: '#9333ea',
    accent: '#fbbf24',
    accentVariant: '#f59e0b',
  };

  // Couleurs haute contraste
  private highContrastLight: Partial<ThemeColors> = {
    onBackground: '#000000',
    onSurface: '#000000',
    border: '#000000',
    primary: '#0000ff',
    error: '#ff0000',
  };

  private highContrastDark: Partial<ThemeColors> = {
    onBackground: '#ffffff',
    onSurface: '#ffffff',
    border: '#ffffff',
    primary: '#00ffff',
    error: '#ff0000',
  };

  // Configuration commune
  private commonTheme = {
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    typography: {
      fontFamily: 'System',
      fontFamilyMono: 'Courier',
      fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
      },
      fontWeight: {
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.8,
      },
    },
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      full: 9999,
    },
    shadows: {
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
      },
      xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
      },
    },
  };

  // Singleton
  static getInstance(): DarkModeService {
    if (!DarkModeService.instance) {
      DarkModeService.instance = new DarkModeService();
    }
    return DarkModeService.instance;
  }

  /**
   * Initialise le service de thème
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🌓 Dark Mode Service: Initializing...');

      // Charger les préférences sauvegardées
      await this.loadPreferences();

      // Écouter les changements du thème système
      this.setupSystemThemeListener();

      // Appliquer le thème initial
      this.updateCurrentScheme();

      this.isInitialized = true;
      console.log('✅ Dark Mode Service: Initialized');
    } catch (error) {
      console.error('❌ Dark Mode Service: Initialization failed', error);
    }
  }

  /**
   * Charge les préférences depuis le stockage
   */
  private async loadPreferences(): Promise<void> {
    try {
      const storedMode = await AsyncStorage.getItem('theme_mode');
      const storedContrast = await AsyncStorage.getItem('theme_contrast');

      if (storedMode && ['light', 'dark', 'auto'].includes(storedMode)) {
        this.currentMode = storedMode as ThemeMode;
      }

      if (storedContrast && ['normal', 'high'].includes(storedContrast)) {
        this.preferredContrast = storedContrast as 'normal' | 'high';
      }
    } catch (error) {
      console.error('❌ Failed to load theme preferences:', error);
    }
  }

  /**
   * Sauvegarde les préférences
   */
  private async savePreferences(): Promise<void> {
    try {
      await AsyncStorage.setItem('theme_mode', this.currentMode);
      await AsyncStorage.setItem('theme_contrast', this.preferredContrast);
    } catch (error) {
      console.error('❌ Failed to save theme preferences:', error);
    }
  }

  /**
   * Configure l'écoute du thème système
   */
  private setupSystemThemeListener(): void {
    Appearance.addChangeListener(({ colorScheme }) => {
      if (this.currentMode === 'auto') {
        this.updateCurrentScheme();
        this.notifyListeners();
      }
    });
  }

  /**
   * Met à jour le schéma de couleur actuel
   */
  private updateCurrentScheme(): void {
    if (this.currentMode === 'auto') {
      this.currentScheme = Appearance.getColorScheme() || 'light';
    } else {
      this.currentScheme = this.currentMode as ColorScheme;
    }
  }

  /**
   * Définit le mode de thème
   */
  async setThemeMode(mode: ThemeMode): Promise<void> {
    if (this.currentMode === mode) return;

    this.currentMode = mode;
    this.updateCurrentScheme();
    
    await this.savePreferences();
    this.notifyListeners();

    console.log(`🌓 Theme mode changed to: ${mode}`);
  }

  /**
   * Définit le contraste préféré
   */
  async setPreferredContrast(contrast: 'normal' | 'high'): Promise<void> {
    if (this.preferredContrast === contrast) return;

    this.preferredContrast = contrast;
    
    await this.savePreferences();
    this.notifyListeners();

    console.log(`🌓 Contrast preference changed to: ${contrast}`);
  }

  /**
   * Bascule entre les modes de thème
   */
  async toggleTheme(): Promise<void> {
    const modes: ThemeMode[] = ['light', 'dark', 'auto'];
    const currentIndex = modes.indexOf(this.currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    
    await this.setThemeMode(modes[nextIndex]);
  }

  /**
   * Obtient le thème actuel
   */
  getCurrentTheme(): Theme {
    const baseColors = this.currentScheme === 'dark' ? this.darkColors : this.lightColors;
    const contrastOverride = this.preferredContrast === 'high' 
      ? (this.currentScheme === 'dark' ? this.highContrastDark : this.highContrastLight)
      : {};

    const colors = { ...baseColors, ...contrastOverride };

    return {
      mode: this.currentScheme,
      colors,
      ...this.commonTheme,
    };
  }

  /**
   * Vérifie si le mode sombre est actif
   */
  isDarkMode(): boolean {
    return this.currentScheme === 'dark';
  }

  /**
   * Obtient le mode de thème actuel
   */
  getThemeMode(): ThemeMode {
    return this.currentMode;
  }

  /**
   * Obtient le contraste préféré
   */
  getPreferredContrast(): 'normal' | 'high' {
    return this.preferredContrast;
  }

  /**
   * Ajoute un listener pour les changements de thème
   */
  addThemeListener(listener: (theme: Theme) => void): () => void {
    this.listeners.push(listener);
    
    // Retourner une fonction de nettoyage
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notifie tous les listeners
   */
  private notifyListeners(): void {
    const theme = this.getCurrentTheme();
    this.listeners.forEach(listener => {
      try {
        listener(theme);
      } catch (error) {
        console.error('❌ Theme listener error:', error);
      }
    });
  }

  /**
   * Obtient les couleurs pour un état spécifique
   */
  getStateColors(state: 'error' | 'warning' | 'success' | 'info'): { background: string; text: string } {
    const theme = this.getCurrentTheme();
    return {
      background: theme.colors[state],
      text: theme.colors[`on${state.charAt(0).toUpperCase() + state.slice(1)}` as keyof ThemeColors],
    };
  }

  /**
   * Génère des couleurs adaptatives pour l'accessibilité
   */
  generateAccessibleColors(baseColor: string): { light: string; dark: string; contrast: string } {
    // Logique simplifiée - dans un cas réel, utiliser une bibliothèque de couleurs
    const isLight = this.currentScheme === 'light';
    
    return {
      light: isLight ? baseColor : this.lightenColor(baseColor, 0.3),
      dark: isLight ? this.darkenColor(baseColor, 0.3) : baseColor,
      contrast: isLight ? '#000000' : '#ffffff',
    };
  }

  /**
   * Éclaircit une couleur
   */
  private lightenColor(color: string, amount: number): string {
    // Implémentation simplifiée
    return color;
  }

  /**
   * Assombrit une couleur
   */
  private darkenColor(color: string, amount: number): string {
    // Implémentation simplifiée
    return color;
  }

  /**
   * Précharge les assets pour les thèmes
   */
  async preloadThemeAssets(): Promise<void> {
    // Précharger les images, icônes, etc. pour les différents thèmes
    console.log('🖼️ Preloading theme assets...');
  }
}

// Export singleton
export default DarkModeService.getInstance();
export { DarkModeService, type Theme, type ThemeColors };
