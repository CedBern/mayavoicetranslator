/**
 * 🌐 PWA SERVICE - GESTION SERVICE WORKER
 * 
 * Fonctionnalités :
 * - Enregistrement service worker
 * - Gestion cache
 * - Notifications push
 * - Background sync
 * - Installation PWA
 */

class PWAService {
  private static instance: PWAService;
  private serviceWorker: ServiceWorkerRegistration | null = null;
  private isOnline: boolean = navigator.onLine;
  private updateAvailable: boolean = false;
  private installPrompt: BeforeInstallPromptEvent | null = null;

  // Singleton pattern
  static getInstance(): PWAService {
    if (!PWAService.instance) {
      PWAService.instance = new PWAService();
    }
    return PWAService.instance;
  }

  /**
   * Initialise le service PWA
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('🌐 PWA Service: Initializing...');
      
      // Vérifier le support PWA
      if (!this.isPWASupported()) {
        console.warn('⚠️ PWA not supported in this browser');
        return false;
      }

      // Enregistrer le service worker
      await this.registerServiceWorker();
      
      // Configurer les listeners
      this.setupEventListeners();
      
      // Vérifier l'état de la connexion
      this.updateNetworkStatus();
      
      console.log('✅ PWA Service: Initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ PWA Service: Initialization failed', error);
      return false;
    }
  }

  /**
   * Vérifie si PWA est supporté
   */
  isPWASupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'caches' in window &&
      'fetch' in window
    );
  }

  /**
   * Enregistre le service worker
   */
  async registerServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Workers not supported');
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      this.serviceWorker = registration;
      console.log('✅ Service Worker registered:', registration.scope);

      // Vérifier les mises à jour
      registration.addEventListener('updatefound', () => {
        this.handleServiceWorkerUpdate(registration);
      });

      // Si déjà installé, vérifier les mises à jour
      if (registration.active) {
        this.checkForUpdates();
      }

    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      throw error;
    }
  }

  /**
   * Gère les mises à jour du service worker
   */
  private handleServiceWorkerUpdate(registration: ServiceWorkerRegistration): void {
    const newWorker = registration.installing;
    if (!newWorker) return;

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        console.log('🔄 New version available');
        this.updateAvailable = true;
        this.notifyUpdateAvailable();
      }
    });
  }

  /**
   * Notifie qu'une mise à jour est disponible
   */
  private notifyUpdateAvailable(): void {
    // Émettre un événement custom pour l'UI
    window.dispatchEvent(new CustomEvent('pwa-update-available', {
      detail: { updateAvailable: true }
    }));
  }

  /**
   * Active la nouvelle version
   */
  async activateUpdate(): Promise<void> {
    if (!this.serviceWorker || !this.updateAvailable) {
      return;
    }

    try {
      const waiting = this.serviceWorker.waiting;
      if (waiting) {
        waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Recharger la page après activation
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('❌ Failed to activate update:', error);
    }
  }

  /**
   * Vérifie les mises à jour
   */
  async checkForUpdates(): Promise<void> {
    if (!this.serviceWorker) return;

    try {
      await this.serviceWorker.update();
      console.log('🔄 Checked for updates');
    } catch (error) {
      console.error('❌ Update check failed:', error);
    }
  }

  /**
   * Configure les listeners d'événements
   */
  private setupEventListeners(): void {
    // Statut de connexion
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnlineStatusChange(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOnlineStatusChange(false);
    });

    // Installation PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e as BeforeInstallPromptEvent;
      this.notifyInstallAvailable();
    });

    // Installation réussie
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installed successfully');
      this.installPrompt = null;
    });

    // Visibilité de la page
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.checkForUpdates();
      }
    });
  }

  /**
   * Gère le changement de statut en ligne/hors ligne
   */
  private handleOnlineStatusChange(isOnline: boolean): void {
    console.log(`🌐 Network status: ${isOnline ? 'online' : 'offline'}`);
    
    // Émettre un événement pour l'UI
    window.dispatchEvent(new CustomEvent('network-status-change', {
      detail: { isOnline }
    }));

    // Synchroniser en arrière-plan si connexion rétablie
    if (isOnline && this.serviceWorker) {
      this.triggerBackgroundSync();
    }
  }

  /**
   * Déclenche la synchronisation en arrière-plan
   */
  private async triggerBackgroundSync(): Promise<void> {
    if (!this.serviceWorker) {
      return;
    }

    try {
      // Vérifier si l'API sync est disponible
      if ('sync' in (this.serviceWorker as any)) {
        await (this.serviceWorker as any).sync.register('background-translation');
        console.log('🔄 Background sync registered');
      } else {
        // Fallback: envoyer un message au service worker
        navigator.serviceWorker.controller?.postMessage({
          type: 'MANUAL_SYNC',
          action: 'background-translation'
        });
      }
    } catch (error) {
      console.error('❌ Background sync registration failed:', error);
    }
  }

  /**
   * Notifie que l'installation PWA est disponible
   */
  private notifyInstallAvailable(): void {
    window.dispatchEvent(new CustomEvent('pwa-install-available', {
      detail: { canInstall: true }
    }));
  }

  /**
   * Propose l'installation de la PWA
   */
  async promptInstall(): Promise<boolean> {
    if (!this.installPrompt) {
      console.warn('⚠️ Install prompt not available');
      return false;
    }

    try {
      const result = await this.installPrompt.prompt();
      const userChoice = await result.userChoice;
      
      console.log(`User response to install prompt: ${userChoice}`);
      
      if (userChoice === 'accepted') {
        this.installPrompt = null;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Install prompt failed:', error);
      return false;
    }
  }

  /**
   * Met à jour le statut réseau
   */
  private updateNetworkStatus(): void {
    this.isOnline = navigator.onLine;
    this.handleOnlineStatusChange(this.isOnline);
  }

  /**
   * Gère les notifications push
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('⚠️ Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  /**
   * Envoie une notification
   */
  async showNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (!this.serviceWorker) {
      throw new Error('Service Worker not registered');
    }

    const hasPermission = await this.requestNotificationPermission();
    if (!hasPermission) {
      throw new Error('Notification permission denied');
    }

    await this.serviceWorker.showNotification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      ...options,
    });
  }

  /**
   * Gère le cache
   */
  async clearCache(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
      console.log('🗑️ All caches cleared');
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
    }
  }

  /**
   * Obtient la taille du cache
   */
  async getCacheSize(): Promise<number> {
    try {
      const cacheNames = await caches.keys();
      let totalSize = 0;

      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const requests = await cache.keys();

        for (const request of requests) {
          const response = await cache.match(request);
          if (response) {
            const clone = response.clone();
            const buffer = await clone.arrayBuffer();
            totalSize += buffer.byteLength;
          }
        }
      }

      return totalSize;
    } catch (error) {
      console.error('❌ Failed to calculate cache size:', error);
      return 0;
    }
  }

  /**
   * État de l'installation PWA
   */
  get canInstall(): boolean {
    return this.installPrompt !== null;
  }

  /**
   * État de la connexion
   */
  get isOnlineStatus(): boolean {
    return this.isOnline;
  }

  /**
   * État de la mise à jour
   */
  get hasUpdateAvailable(): boolean {
    return this.updateAvailable;
  }
}

// Interface pour l'événement beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<{ userChoice: Promise<'accepted' | 'dismissed'> }>;
  userChoice: Promise<'accepted' | 'dismissed'>;
}

// Export singleton
export default PWAService.getInstance();
export { PWAService };
