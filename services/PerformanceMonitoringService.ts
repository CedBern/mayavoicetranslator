/**
 * 📊 PERFORMANCE MONITORING SERVICE
 * 
 * Fonctionnalités :
 * - Web Vitals monitoring
 * - Real User Monitoring (RUM)
 * - Performance metrics
 * - Error tracking
 * - Analytics intégré
 */

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url?: string;
  userAgent?: string;
}

interface WebVitalsMetric extends PerformanceMetric {
  delta: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}

interface ErrorMetric {
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  timestamp: number;
  url: string;
  userAgent: string;
  componentStack?: string;
}

class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorMetric[] = [];
  private observer: PerformanceObserver | null = null;
  private isInitialized: boolean = false;

  // Seuils pour les Web Vitals
  private static readonly THRESHOLDS = {
    CLS: { good: 0.1, poor: 0.25 },
    FID: { good: 100, poor: 300 },
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    TTFB: { good: 800, poor: 1800 },
  };

  // Singleton pattern
  static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService();
    }
    return PerformanceMonitoringService.instance;
  }

  /**
   * Initialise le monitoring des performances
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('📊 Performance Monitoring: Initializing...');

      // Surveiller les Web Vitals
      this.initializeWebVitals();

      // Surveiller les erreurs
      this.initializeErrorTracking();

      // Surveiller les performances réseau
      this.initializeNetworkMonitoring();

      // Surveiller les performances de rendu
      this.initializeRenderingMonitoring();

      // Surveiller la mémoire
      this.initializeMemoryMonitoring();

      // Envoyer les métriques périodiquement
      this.startPeriodicReporting();

      this.isInitialized = true;
      console.log('✅ Performance Monitoring: Initialized');
    } catch (error) {
      console.error('❌ Performance Monitoring: Initialization failed', error);
    }
  }

  /**
   * Initialise le monitoring des Web Vitals
   */
  private initializeWebVitals(): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('⚠️ PerformanceObserver not supported');
      return;
    }

    try {
      // Observer pour LCP (Largest Contentful Paint)
      this.observeMetric('largest-contentful-paint', (entries) => {
        for (const entry of entries) {
          this.recordWebVital('LCP', entry.startTime);
        }
      });

      // Observer pour FID (First Input Delay)
      this.observeMetric('first-input', (entries) => {
        for (const entry of entries) {
          this.recordWebVital('FID', entry.processingStart - entry.startTime);
        }
      });

      // Observer pour CLS (Cumulative Layout Shift)
      this.observeMetric('layout-shift', (entries) => {
        let cumulativeScore = 0;
        for (const entry of entries) {
          if (!entry.hadRecentInput) {
            cumulativeScore += entry.value;
          }
        }
        if (cumulativeScore > 0) {
          this.recordWebVital('CLS', cumulativeScore);
        }
      });

      // FCP et TTFB via Navigation Timing
      this.measureNavigationTiming();

    } catch (error) {
      console.error('❌ Web Vitals monitoring failed:', error);
    }
  }

  /**
   * Observe une métrique spécifique
   */
  private observeMetric(type: string, callback: (entries: any[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ type, buffered: true });
    } catch (error) {
      console.warn(`⚠️ Cannot observe ${type}:`, error);
    }
  }

  /**
   * Mesure les métriques de navigation
   */
  private measureNavigationTiming(): void {
    if (!('performance' in window) || !performance.getEntriesByType) return;

    // Attendre que la page soit chargée
    if (document.readyState === 'complete') {
      this.processNavigationTiming();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.processNavigationTiming(), 0);
      });
    }
  }

  /**
   * Traite les métriques de navigation
   */
  private processNavigationTiming(): void {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (!navigation) return;

    // TTFB (Time to First Byte)
    const ttfb = navigation.responseStart - navigation.fetchStart;
    this.recordWebVital('TTFB', ttfb);

    // FCP (First Contentful Paint)
    const paint = performance.getEntriesByType('paint');
    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
    if (fcp) {
      this.recordWebVital('FCP', fcp.startTime);
    }

    // Autres métriques utiles
    this.recordMetric('DNS_LOOKUP', navigation.domainLookupEnd - navigation.domainLookupStart);
    this.recordMetric('TCP_CONNECT', navigation.connectEnd - navigation.connectStart);
    this.recordMetric('DOM_LOAD', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
    this.recordMetric('PAGE_LOAD', navigation.loadEventEnd - navigation.loadEventStart);
  }

  /**
   * Enregistre une Web Vital
   */
  private recordWebVital(name: string, value: number): void {
    const rating = this.getVitalRating(name, value);
    const metric: WebVitalsMetric = {
      name,
      value,
      delta: value,
      id: `${name}-${Date.now()}-${Math.random()}`,
      rating,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.metrics.push(metric);
    
    // Envoyer immédiatement les métriques critiques
    if (rating === 'poor') {
      this.sendMetrics([metric]);
    }

    console.log(`📊 Web Vital recorded: ${name} = ${value.toFixed(2)}ms (${rating})`);
  }

  /**
   * Détermine la note d'une Web Vital
   */
  private getVitalRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = PerformanceMonitoringService.THRESHOLDS[name as keyof typeof PerformanceMonitoringService.THRESHOLDS];
    if (!thresholds) return 'good';

    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Enregistre une métrique générale
   */
  recordMetric(name: string, value: number): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    this.metrics.push(metric);
  }

  /**
   * Initialise le suivi des erreurs
   */
  private initializeErrorTracking(): void {
    // Erreurs JavaScript globales
    window.addEventListener('error', (event) => {
      this.recordError({
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });

    // Promesses rejetées non gérées
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });
  }

  /**
   * Enregistre une erreur
   */
  recordError(error: ErrorMetric): void {
    this.errors.push(error);
    console.error('📊 Error recorded:', error);

    // Envoyer les erreurs critiques immédiatement
    this.sendErrors([error]);
  }

  /**
   * Initialise le monitoring réseau
   */
  private initializeNetworkMonitoring(): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            this.processResourceTiming(entry as PerformanceResourceTiming);
          }
        }
      });

      observer.observe({ type: 'resource', buffered: true });
    } catch (error) {
      console.warn('⚠️ Network monitoring not available:', error);
    }
  }

  /**
   * Traite les métriques de ressources
   */
  private processResourceTiming(entry: PerformanceResourceTiming): void {
    // Métriques par type de ressource
    const resourceType = this.getResourceType(entry.name);
    const duration = entry.responseEnd - entry.startTime;

    this.recordMetric(`RESOURCE_${resourceType.toUpperCase()}_LOAD`, duration);

    // Métriques de transfert
    if (entry.transferSize > 0) {
      this.recordMetric(`RESOURCE_${resourceType.toUpperCase()}_SIZE`, entry.transferSize);
    }
  }

  /**
   * Détermine le type de ressource
   */
  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'style';
    if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return 'image';
    if (url.includes('/api/')) return 'api';
    return 'other';
  }

  /**
   * Initialise le monitoring de rendu
   */
  private initializeRenderingMonitoring(): void {
    // Surveiller les changements DOM
    let domChangeCount = 0;
    const observer = new MutationObserver(() => {
      domChangeCount++;
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    // Enregistrer périodiquement
    setInterval(() => {
      if (domChangeCount > 0) {
        this.recordMetric('DOM_MUTATIONS', domChangeCount);
        domChangeCount = 0;
      }
    }, 5000);
  }

  /**
   * Initialise le monitoring mémoire
   */
  private initializeMemoryMonitoring(): void {
    // Vérifier si l'API mémoire est disponible
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        this.recordMetric('MEMORY_USED', memory.usedJSHeapSize);
        this.recordMetric('MEMORY_TOTAL', memory.totalJSHeapSize);
        this.recordMetric('MEMORY_LIMIT', memory.jsHeapSizeLimit);
      }, 10000);
    }
  }

  /**
   * Démarre le reporting périodique
   */
  private startPeriodicReporting(): void {
    // Envoyer les métriques toutes les 30 secondes
    setInterval(() => {
      if (this.metrics.length > 0) {
        this.sendMetrics(this.metrics.splice(0));
      }
      if (this.errors.length > 0) {
        this.sendErrors(this.errors.splice(0));
      }
    }, 30000);

    // Envoyer avant fermeture de page
    window.addEventListener('beforeunload', () => {
      this.sendMetrics(this.metrics);
      this.sendErrors(this.errors);
    });
  }

  /**
   * Envoie les métriques au serveur
   */
  private async sendMetrics(metrics: PerformanceMetric[]): Promise<void> {
    if (metrics.length === 0) return;

    try {
      // Utiliser sendBeacon si disponible
      if ('sendBeacon' in navigator) {
        const data = JSON.stringify({ metrics, type: 'performance' });
        navigator.sendBeacon('/api/analytics/performance', data);
      } else {
        // Fallback vers fetch
        await fetch('/api/analytics/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ metrics }),
          keepalive: true,
        });
      }
    } catch (error) {
      console.warn('⚠️ Failed to send performance metrics:', error);
    }
  }

  /**
   * Envoie les erreurs au serveur
   */
  private async sendErrors(errors: ErrorMetric[]): Promise<void> {
    if (errors.length === 0) return;

    try {
      // Utiliser sendBeacon si disponible
      if ('sendBeacon' in navigator) {
        const data = JSON.stringify({ errors, type: 'error' });
        navigator.sendBeacon('/api/analytics/errors', data);
      } else {
        // Fallback vers fetch
        await fetch('/api/analytics/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ errors }),
          keepalive: true,
        });
      }
    } catch (error) {
      console.warn('⚠️ Failed to send error data:', error);
    }
  }

  /**
   * Mesure le temps d'exécution d'une fonction
   */
  async measureFunction<T>(name: string, fn: () => Promise<T> | T): Promise<T> {
    const startTime = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      this.recordMetric(`FUNCTION_${name.toUpperCase()}`, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordMetric(`FUNCTION_${name.toUpperCase()}_ERROR`, duration);
      throw error;
    }
  }

  /**
   * Marque un point de performance personnalisé
   */
  mark(name: string): void {
    performance.mark(name);
    this.recordMetric(`MARK_${name.toUpperCase()}`, performance.now());
  }

  /**
   * Mesure le temps entre deux marques
   */
  measure(name: string, startMark: string, endMark?: string): void {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name, 'measure')[0];
      if (measure) {
        this.recordMetric(`MEASURE_${name.toUpperCase()}`, measure.duration);
      }
    } catch (error) {
      console.warn(`⚠️ Failed to measure ${name}:`, error);
    }
  }

  /**
   * Obtient un résumé des performances
   */
  getPerformanceSummary(): any {
    return {
      metrics: this.metrics.length,
      errors: this.errors.length,
      isInitialized: this.isInitialized,
      lastMetrics: this.metrics.slice(-5),
      lastErrors: this.errors.slice(-3),
    };
  }
}

// Export singleton
export default PerformanceMonitoringService.getInstance();
export { PerformanceMonitoringService };
