/**
 * 🖼️ IMAGE OPTIMIZATION UTILITIES
 * 
 * Utilitaires pour l'optimisation des images dans l'application TalkKin.
 * Includes lazy loading, compression, and format optimization.
 */

import React, { useState, useRef, useEffect, memo } from 'react';
import { Image, View, StyleSheet, Animated, Dimensions } from 'react-native';

// Types
interface OptimizedImageProps {
  source: any;
  style?: any;
  quality?: 'low' | 'medium' | 'high';
  lazy?: boolean;
  placeholder?: React.ComponentType;
  onLoad?: () => void;
  onError?: () => void;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

interface ImageCacheEntry {
  uri: string;
  timestamp: number;
  size: number;
}

// Image cache manager
class ImageCacheManager {
  private static cache = new Map<string, ImageCacheEntry>();
  private static maxCacheSize = 50 * 1024 * 1024; // 50MB
  private static currentCacheSize = 0;

  static addToCache(uri: string, size: number) {
    // Remove old entries if cache is full
    if (this.currentCacheSize + size > this.maxCacheSize) {
      this.cleanup();
    }

    this.cache.set(uri, {
      uri,
      timestamp: Date.now(),
      size,
    });
    this.currentCacheSize += size;
  }

  static isInCache(uri: string): boolean {
    return this.cache.has(uri);
  }

  static cleanup() {
    // Remove oldest entries
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toRemove = entries.slice(0, Math.floor(entries.length / 2));
    toRemove.forEach(([uri, entry]) => {
      this.cache.delete(uri);
      this.currentCacheSize -= entry.size;
    });
  }

  static getCacheStats() {
    return {
      totalEntries: this.cache.size,
      totalSize: this.currentCacheSize,
      maxSize: this.maxCacheSize,
      utilization: (this.currentCacheSize / this.maxCacheSize) * 100,
    };
  }
}

// Placeholder component
const DefaultPlaceholder = memo(() => (
  <View style={[styles.placeholder, { backgroundColor: '#e2e8f0' }]}>
    <Animated.View style={styles.shimmer} />
  </View>
));

// Lazy image component with optimization
export const OptimizedImage = memo(function OptimizedImage({
  source,
  style,
  quality = 'medium',
  lazy = true,
  placeholder: Placeholder = DefaultPlaceholder,
  onLoad,
  onError,
  resizeMode = 'cover',
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInViewport, setIsInViewport] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const viewRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Viewport detection for lazy loading
  useEffect(() => {
    if (!lazy) return;

    const checkViewport = () => {
      if (viewRef.current) {
        viewRef.current.measure((x, y, width, height, pageX, pageY) => {
          const screenHeight = Dimensions.get('window').height;
          const isVisible = pageY < screenHeight && pageY + height > 0;
          if (isVisible && !isInViewport) {
            setIsInViewport(true);
          }
        });
      }
    };

    // Check viewport on mount and scroll
    const timer = setTimeout(checkViewport, 100);
    return () => clearTimeout(timer);
  }, [lazy, isInViewport]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Add to cache
    if (source.uri) {
      ImageCacheManager.addToCache(source.uri, 0); // Size would be determined dynamically
    }

    onLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
    onError?.();
  };

  // Get optimized source based on quality
  const getOptimizedSource = () => {
    if (!source.uri) return source;

    // In a real implementation, this would modify the URI to request different sizes/qualities
    const qualityParams = {
      low: '?w=300&q=60',
      medium: '?w=600&q=80',
      high: '?w=1200&q=95',
    };

    return {
      ...source,
      uri: `${source.uri}${qualityParams[quality]}`,
    };
  };

  // Don't render if not in viewport (lazy loading)
  if (!isInViewport) {
    return (
      <View ref={viewRef} style={[style, styles.placeholder]}>
        <Placeholder />
      </View>
    );
  }

  // Show placeholder while loading
  if (!isLoaded && !hasError) {
    return (
      <View ref={viewRef} style={[style, styles.container]}>
        <Placeholder />
        <Image
          source={getOptimizedSource()}
          style={[style, styles.hiddenImage]}
          onLoad={handleLoad}
          onError={handleError}
          resizeMode={resizeMode}
          {...props}
        />
      </View>
    );
  }

  // Show error state
  if (hasError) {
    return (
      <View ref={viewRef} style={[style, styles.errorContainer]}>
        <Placeholder />
      </View>
    );
  }

  // Show loaded image
  return (
    <View ref={viewRef} style={[style, styles.container]}>
      <Animated.Image
        source={getOptimizedSource()}
        style={[style, { opacity: fadeAnim }]}
        onLoad={handleLoad}
        onError={handleError}
        resizeMode={resizeMode}
        {...props}
      />
    </View>
  );
});

// Progressive image loader for multiple resolutions
export const ProgressiveImage = memo(function ProgressiveImage({
  source,
  lowResSource,
  style,
  onLoad,
  ...props
}: OptimizedImageProps & { lowResSource?: any }) {
  const [highResLoaded, setHighResLoaded] = useState(false);
  const highResOpacity = useRef(new Animated.Value(0)).current;

  const handleHighResLoad = () => {
    setHighResLoaded(true);
    Animated.timing(highResOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    onLoad?.();
  };

  return (
    <View style={[style, styles.container]}>
      {/* Low resolution placeholder */}
      {lowResSource && !highResLoaded && (
        <OptimizedImage
          source={lowResSource}
          style={[style, StyleSheet.absoluteFill]}
          quality="low"
          lazy={false}
          {...props}
        />
      )}
      
      {/* High resolution image */}
      <Animated.Image
        source={source}
        style={[style, StyleSheet.absoluteFill, { opacity: highResOpacity }]}
        onLoad={handleHighResLoad}
        {...props}
      />
    </View>
  );
});

// Image preloader utility
export class ImagePreloader {
  private static preloadQueue: string[] = [];
  private static isPreloading = false;

  static preload(uris: string[]): Promise<void[]> {
    return Promise.all(
      uris.map(uri => this.preloadSingle(uri))
    );
  }

  static preloadSingle(uri: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // React Native image preloading
      Image.prefetch(uri)
        .then(() => {
          ImageCacheManager.addToCache(uri, 0);
          resolve();
        })
        .catch(reject);
    });
  }

  static addToQueue(uri: string) {
    if (!this.preloadQueue.includes(uri)) {
      this.preloadQueue.push(uri);
      this.processQueue();
    }
  }

  private static async processQueue() {
    if (this.isPreloading || this.preloadQueue.length === 0) return;

    this.isPreloading = true;
    const uri = this.preloadQueue.shift();
    
    if (uri) {
      try {
        await this.preloadSingle(uri);
      } catch (error) {
        console.warn('Failed to preload image:', uri, error);
      }
    }

    this.isPreloading = false;
    if (this.preloadQueue.length > 0) {
      setTimeout(() => this.processQueue(), 100);
    }
  }
}

// Hook for image optimization
export function useImageOptimization() {
  const [cacheStats, setCacheStats] = useState(ImageCacheManager.getCacheStats());

  const refreshStats = () => {
    setCacheStats(ImageCacheManager.getCacheStats());
  };

  const clearCache = () => {
    ImageCacheManager.cleanup();
    refreshStats();
  };

  return {
    cacheStats,
    refreshStats,
    clearCache,
    preloadImages: ImagePreloader.preload,
  };
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  placeholder: {
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shimmer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f5f9',
    opacity: 0.7,
  },
  hiddenImage: {
    position: 'absolute',
    opacity: 0,
    zIndex: -1,
  },
  errorContainer: {
    backgroundColor: '#fed7d7',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default {
  OptimizedImage,
  ProgressiveImage,
  ImagePreloader,
  ImageCacheManager,
  useImageOptimization,
};
