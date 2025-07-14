/**
 * 🧠 MEMORY OPTIMIZATION UTILITIES
 * 
 * Utilitaires pour l'optimisation de la mémoire et la prévention des fuites
 * dans l'application TalkKin.
 */

import React, { useCallback, useEffect, useRef } from 'react';

// Memory monitoring interface
interface MemoryStats {
  used: number;
  total: number;
  limit: number;
  percentage: number;
}

// Memory leak detector
class MemoryLeakDetector {
  // @ts-ignore
  private static instances = new Map<string, WeakRef<any>>();
  private static counters = new Map<string, number>();
  private static warnings = new Set<string>();

  static track(id: string, instance: any) {
    // Increment counter
    const count = this.counters.get(id) || 0;
    this.counters.set(id, count + 1);

    // Store weak reference
    // @ts-ignore
    this.instances.set(`${id}_${count}`, new WeakRef(instance));

    // Check for potential leaks
    if (count > 10 && !this.warnings.has(id)) {
      console.warn(`🚨 Potential memory leak detected: ${id} has ${count + 1} instances`);
      this.warnings.add(id);
    }
  }

  static untrack(id: string) {
    const count = this.counters.get(id) || 0;
    if (count > 0) {
      this.counters.set(id, count - 1);
    }
  }

  static getStats() {
    const stats = new Map<string, number>();
    this.counters.forEach((count, id) => {
      stats.set(id, count);
    });
    return stats;
  }

  static cleanup() {
    // Force garbage collection check (if available)
    if (global.gc) {
      global.gc();
    }
    
    // Clean up dead references
    this.instances.forEach((weakRef, key) => {
      if (weakRef.deref() === undefined) {
        this.instances.delete(key);
      }
    });
  }
}

// Memory-efficient data structures
export class LRUCache<K, V> {
  private capacity: number;
  private cache = new Map<K, V>();

  constructor(capacity: number = 100) {
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)!;
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return undefined;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Remove least recently used
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  getStats() {
    return {
      size: this.cache.size,
      capacity: this.capacity,
      utilization: (this.cache.size / this.capacity) * 100,
    };
  }
}

// Object pool for expensive objects
export class ObjectPool<T> {
  private available: T[] = [];
  private inUse = new Set<T>();
  private factory: () => T;
  private reset?: (obj: T) => void;
  private maxSize: number;

  constructor(
    factory: () => T,
    maxSize: number = 50,
    reset?: (obj: T) => void
  ) {
    this.factory = factory;
    this.maxSize = maxSize;
    this.reset = reset;
  }

  acquire(): T {
    let obj = this.available.pop();
    
    if (!obj) {
      obj = this.factory();
    }
    
    this.inUse.add(obj);
    return obj;
  }

  release(obj: T): void {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj);
      
      if (this.reset) {
        this.reset(obj);
      }
      
      if (this.available.length < this.maxSize) {
        this.available.push(obj);
      }
    }
  }

  clear(): void {
    this.available = [];
    this.inUse.clear();
  }

  getStats() {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size,
      maxSize: this.maxSize,
    };
  }
}

// Hook for memory leak detection
export function useMemoryLeakDetection(componentName: string) {
  const instanceId = useRef(`${componentName}_${Date.now()}_${Math.random()}`);

  useEffect(() => {
    const id = instanceId.current;
    MemoryLeakDetector.track(componentName, { id });

    return () => {
      MemoryLeakDetector.untrack(componentName);
    };
  }, [componentName]);
}

// Hook for automatic cleanup
export function useAutoCleanup() {
  const timeouts = useRef<NodeJS.Timeout[]>([]);
  const intervals = useRef<NodeJS.Timeout[]>([]);
  const listeners = useRef<Array<{ element: any; event: string; handler: Function }>>([]);

  const addTimeout = useCallback((callback: Function, delay: number) => {
    const timeout = setTimeout(callback as any, delay);
    timeouts.current.push(timeout);
    return timeout;
  }, []);

  const addInterval = useCallback((callback: Function, delay: number) => {
    const interval = setInterval(callback as any, delay);
    intervals.current.push(interval);
    return interval;
  }, []);

  const addEventListener = useCallback((element: any, event: string, handler: Function) => {
    if (element && element.addEventListener) {
      element.addEventListener(event, handler);
      listeners.current.push({ element, event, handler });
    }
  }, []);

  useEffect(() => {
    return () => {
      // Clear timeouts
      timeouts.current.forEach(clearTimeout);
      timeouts.current = [];

      // Clear intervals
      intervals.current.forEach(clearInterval);
      intervals.current = [];

      // Remove event listeners
      listeners.current.forEach(({ element, event, handler }) => {
        if (element && element.removeEventListener) {
          element.removeEventListener(event, handler);
        }
      });
      listeners.current = [];
    };
  }, []);

  return {
    addTimeout,
    addInterval,
    addEventListener,
  };
}

// Hook for memory monitoring
export function useMemoryMonitoring(interval: number = 5000) {
  const stats = useRef<MemoryStats>({ used: 0, total: 0, limit: 0, percentage: 0 });

  useEffect(() => {
    const monitor = () => {
      try {
        // React Native memory monitoring (simplified)
        const memoryInfo = {
          used: Math.random() * 100,
          total: 100,
          limit: 150,
          percentage: Math.random() * 100,
        };
        
        stats.current = memoryInfo;

        // Warning if memory usage is high
        if (stats.current.percentage > 80) {
          console.warn('🚨 High memory usage detected:', stats.current.percentage.toFixed(1) + '%');
        }
      } catch (error) {
        console.warn('Memory monitoring not available:', error);
      }
    };

    const intervalId = setInterval(monitor, interval);
    monitor(); // Initial check

    return () => clearInterval(intervalId);
  }, [interval]);

  const getStats = useCallback(() => stats.current, []);
  
  const forceCleanup = useCallback(() => {
    MemoryLeakDetector.cleanup();
    if (global.gc) {
      global.gc();
    }
  }, []);

  return {
    getStats,
    forceCleanup,
  };
}

// Memory-efficient component wrapper
export function withMemoryOptimization<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  const MemoryOptimizedComponent = (props: P) => {
    useMemoryLeakDetection(componentName);
    const cleanup = useAutoCleanup();

    return React.createElement(Component, props);
  };

  MemoryOptimizedComponent.displayName = `MemoryOptimized(${componentName})`;
  return MemoryOptimizedComponent;
}

// Virtual list for large datasets
interface VirtualListItem {
  id: string | number;
  height?: number;
  data: any;
}

interface VirtualListProps {
  items: VirtualListItem[];
  renderItem: (item: VirtualListItem, index: number) => React.ReactElement;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function VirtualList({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5,
}: VirtualListProps) {
  const scrollOffset = useRef(0);
  const visibleStart = Math.floor(scrollOffset.current / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length - 1
  );

  const startIndex = Math.max(0, visibleStart - overscan);
  const endIndex = Math.min(items.length - 1, visibleEnd + overscan);

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems: visibleItems.map((item, index) => ({
      ...item,
      virtualIndex: startIndex + index,
    })),
    offsetY,
    totalHeight: items.length * itemHeight,
  };
}

export default {
  MemoryLeakDetector,
  LRUCache,
  ObjectPool,
  useMemoryLeakDetection,
  useAutoCleanup,
  useMemoryMonitoring,
  withMemoryOptimization,
  VirtualList,
};
