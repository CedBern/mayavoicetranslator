/**
 * 🔄 ÉTAT PERSISTANT HOOK - TALKKIN
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const usePersistentState = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          setValue(JSON.parse(item));
        }
      } catch (error) {
        console.error('Error loading persistent state:', error);
      } finally {
        setLoading(false);
      }
    };

    loadValue();
  }, [key]);

  const updateValue = useCallback(async (newValue: T) => {
    try {
      setValue(newValue);
      await AsyncStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error('Error saving persistent state:', error);
    }
  }, [key]);

  return [value, updateValue, loading] as const;
};

export default usePersistentState;
