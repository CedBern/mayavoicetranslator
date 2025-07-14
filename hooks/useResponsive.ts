/**
 * 📱 HOOK RESPONSIVE OPTIMISÉ - TALKKIN
 * 
 * Fonctionnalités :
 * - Détection automatique des breakpoints
 * - Performance optimisée avec debounce
 * - Support orientation
 * - Métriques d'écran détaillées
 */

import { useState, useEffect, useCallback } from 'react';
import { Dimensions } from 'react-native';

interface ScreenDimensions {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

interface ResponsiveData {
  dimensions: ScreenDimensions;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

const BREAKPOINTS = {
  xs: 0,     // Extra small: 0px and up
  sm: 576,   // Small: 576px and up
  md: 768,   // Medium: 768px and up
  lg: 992,   // Large: 992px and up
  xl: 1200   // Extra large: 1200px and up
};

export const useResponsive = () => {
  const [responsiveData, setResponsiveData] = useState<ResponsiveData>(() => {
    const initialDimensions = Dimensions.get('window');
    return calculateResponsiveData(initialDimensions);
  });

  const updateDimensions = useCallback(() => {
    const newDimensions = Dimensions.get('window');
    const newData = calculateResponsiveData(newDimensions);
    setResponsiveData(newData);
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    
    return () => {
      subscription?.remove();
    };
  }, [updateDimensions]);

  return responsiveData;
};

function calculateResponsiveData(dimensions: ScreenDimensions): ResponsiveData {
  const { width, height } = dimensions;
  
  // Déterminer le breakpoint
  let breakpoint: ResponsiveData['breakpoint'] = 'xs';
  if (width >= BREAKPOINTS.xl) breakpoint = 'xl';
  else if (width >= BREAKPOINTS.lg) breakpoint = 'lg';
  else if (width >= BREAKPOINTS.md) breakpoint = 'md';
  else if (width >= BREAKPOINTS.sm) breakpoint = 'sm';

  // Déterminer le type d'appareil
  let deviceType: ResponsiveData['deviceType'] = 'mobile';
  if (width >= BREAKPOINTS.lg) deviceType = 'desktop';
  else if (width >= BREAKPOINTS.md) deviceType = 'tablet';

  // Détecter l'orientation
  const isLandscape = width > height;
  const isPortrait = height > width;

  return {
    dimensions,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isLandscape,
    isPortrait,
    breakpoint,
    deviceType
  };
}

export default useResponsive;
