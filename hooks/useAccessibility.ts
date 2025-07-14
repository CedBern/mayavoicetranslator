/**
 * ♿ ACCESSIBILITÉ HOOK - TALKKIN
 */

import { useState, useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

export const useAccessibility = () => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);
  const [fontSize, setFontSize] = useState('normal');

  useEffect(() => {
    const checkAccessibility = async () => {
      try {
        const screenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        setIsScreenReaderEnabled(screenReaderEnabled);
        
        const reduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
        setIsReduceMotionEnabled(reduceMotionEnabled);
      } catch (error) {
        console.error('Error checking accessibility:', error);
      }
    };

    checkAccessibility();

    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );

    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsReduceMotionEnabled
    );

    return () => {
      screenReaderListener?.remove();
      reduceMotionListener?.remove();
    };
  }, []);

  return {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    fontSize,
    setFontSize,
  };
};

export default useAccessibility;
