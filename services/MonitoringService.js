/**
 * 📊 Service de monitoring et métriques pour Maya Translator
 * Collecte des métriques de performance, utilisation et santé système
 */

import { EventEmitter } from 'events';
import os from 'os';
import process from 'process';

export class MonitoringService extends EventEmitter {
    constructor() {
        super();
        this.metrics = {
            requests: {
                total: 0,
                success: 0,
                errors: 0,
                byEndpoint: new Map(),
                byUser: new Map(),
                responseTimeAvg: 0,
                responseTimeP95: 0,
                responseTimeP99: 0
            },
            translations: {
                total: 0,
                byLanguagePair: new Map(),
                cacheHits: 0,
                cacheMisses: 0,
                avgConfidence: 0,
                failureRate: 0
            },
            system: {
                uptime: 0,
                memoryUsage: {},
                cpuUsage: 0,
                diskUsage: {},
                activeConnections: 0,
                errorRate: 0
            },
            oauth: {
                tokensIssued: 0,
                tokensRevoked: 0,
                activeTokens: 0,
                authFailures: 0,
                byClient: new Map()
            },
            business: {
                activeUsers: new Set(),
                newUsers: 0,
                premiumUsers: 0,
                apiCallsQuota: new Map(),
                revenue: 0
            }
        };

        this.alerts = [];
        this.thresholds = {
            responseTime: 2000, // 2 secondes
            errorRate: 0.05, // 5%
            memoryUsage: 0.85, // 85%
            cpuUsage: 0.80, // 80%
            diskUsage: 0.90, // 90%
            activeConnections: 1000
        };

        this.startTime = Date.now();
        this.responseTimeSamples = [];
        this.isCollecting = false;

        this.initializeMetricsCollection();
    }

    /**
     * Initialise la collecte automatique de métriques
     */
    initializeMetricsCollection() {
        // Collecte des métriques système toutes les 30 secondes
        this.systemMetricsInterval = setInterval(() => {
            this.collectSystemMetrics();
        }, 30000);

        // Nettoyage des métriques anciennes toutes les heures
        this.cleanupInterval = setInterval(() => {
            this.cleanupOldMetrics();
        }, 3600000);

        console.log('📊 Service de monitoring initialisé');
        this.isCollecting = true;
    }

    /**
     * Enregistre une requête API
     */
    recordRequest(endpoint, method, statusCode, responseTime, userId = null) {
        this.metrics.requests.total++;
        
        if (statusCode >= 200 && statusCode < 400) {
            this.metrics.requests.success++;
        } else {
            this.metrics.requests.errors++;
        }

        // Métriques par endpoint
        const endpointKey = `${method} ${endpoint}`;
        const endpointStats = this.metrics.requests.byEndpoint.get(endpointKey) || {
            count: 0,
            avgResponseTime: 0,
            errors: 0
        };
        
        endpointStats.count++;
        endpointStats.avgResponseTime = 
            (endpointStats.avgResponseTime * (endpointStats.count - 1) + responseTime) / endpointStats.count;
        
        if (statusCode >= 400) {
            endpointStats.errors++;
        }
        
        this.metrics.requests.byEndpoint.set(endpointKey, endpointStats);

        // Métriques par utilisateur
        if (userId) {
            const userStats = this.metrics.requests.byUser.get(userId) || {
                requests: 0,
                errors: 0,
                lastActivity: null
            };
            
            userStats.requests++;
            userStats.lastActivity = new Date();
            
            if (statusCode >= 400) {
                userStats.errors++;
            }
            
            this.metrics.requests.byUser.set(userId, userStats);
            this.metrics.business.activeUsers.add(userId);
        }

        // Temps de réponse
        this.responseTimeSamples.push(responseTime);
        if (this.responseTimeSamples.length > 1000) {
            this.responseTimeSamples.shift();
        }
        
        this.updateResponseTimeMetrics();

        // Vérification des seuils et alertes
        this.checkAlerts(endpoint, responseTime, statusCode);

        this.emit('request', {
            endpoint,
            method,
            statusCode,
            responseTime,
            userId,
            timestamp: new Date()
        });
    }

    /**
     * Enregistre une traduction
     */
    recordTranslation(fromLang, toLang, success, confidence, cacheHit = false) {
        this.metrics.translations.total++;
        
        if (cacheHit) {
            this.metrics.translations.cacheHits++;
        } else {
            this.metrics.translations.cacheMisses++;
        }

        // Paire de langues
        const langPair = `${fromLang}-${toLang}`;
        const pairStats = this.metrics.translations.byLanguagePair.get(langPair) || {
            count: 0,
            successRate: 0,
            avgConfidence: 0
        };
        
        pairStats.count++;
        
        if (success) {
            pairStats.successRate = 
                (pairStats.successRate * (pairStats.count - 1) + 1) / pairStats.count;
            
            if (confidence !== undefined) {
                pairStats.avgConfidence = 
                    (pairStats.avgConfidence * (pairStats.count - 1) + confidence) / pairStats.count;
            }
        } else {
            pairStats.successRate = 
                (pairStats.successRate * (pairStats.count - 1)) / pairStats.count;
        }
        
        this.metrics.translations.byLanguagePair.set(langPair, pairStats);

        // Moyenne globale de confiance
        if (success && confidence !== undefined) {
            const totalSuccess = this.metrics.translations.total - 
                (this.metrics.translations.total * this.metrics.translations.failureRate);
            
            this.metrics.translations.avgConfidence = 
                (this.metrics.translations.avgConfidence * (totalSuccess - 1) + confidence) / totalSuccess;
        }

        this.emit('translation', {
            fromLang,
            toLang,
            success,
            confidence,
            cacheHit,
            timestamp: new Date()
        });
    }

    /**
     * Enregistre une action OAuth
     */
    recordOAuthAction(action, clientId, success = true) {
        switch (action) {
            case 'token_issued':
                this.metrics.oauth.tokensIssued++;
                this.metrics.oauth.activeTokens++;
                break;
            case 'token_revoked':
                this.metrics.oauth.tokensRevoked++;
                this.metrics.oauth.activeTokens = Math.max(0, this.metrics.oauth.activeTokens - 1);
                break;
            case 'auth_failure':
                this.metrics.oauth.authFailures++;
                break;
        }

        // Statistiques par client
        if (clientId) {
            const clientStats = this.metrics.oauth.byClient.get(clientId) || {
                tokensIssued: 0,
                authFailures: 0,
                lastActivity: null
            };
            
            if (action === 'token_issued' && success) {
                clientStats.tokensIssued++;
            } else if (action === 'auth_failure') {
                clientStats.authFailures++;
            }
            
            clientStats.lastActivity = new Date();
            this.metrics.oauth.byClient.set(clientId, clientStats);
        }

        this.emit('oauth', {
            action,
            clientId,
            success,
            timestamp: new Date()
        });
    }

    /**
     * Collecte les métriques système
     */
    collectSystemMetrics() {
        // Uptime
        this.metrics.system.uptime = Date.now() - this.startTime;

        // Mémoire
        const memUsage = process.memoryUsage();
        this.metrics.system.memoryUsage = {
            rss: memUsage.rss,
            heapTotal: memUsage.heapTotal,
            heapUsed: memUsage.heapUsed,
            external: memUsage.external,
            arrayBuffers: memUsage.arrayBuffers,
            percentage: memUsage.heapUsed / memUsage.heapTotal
        };

        // CPU
        const cpus = os.cpus();
        let totalIdle = 0;
        let totalTick = 0;
        
        cpus.forEach(cpu => {
            for (const type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        });
        
        this.metrics.system.cpuUsage = 1 - totalIdle / totalTick;

        // Taux d'erreur
        const totalRequests = this.metrics.requests.total;
        const totalErrors = this.metrics.requests.errors;
        this.metrics.system.errorRate = totalRequests > 0 ? totalErrors / totalRequests : 0;

        // Alertes sur les seuils système
        this.checkSystemThresholds();

        this.emit('systemMetrics', this.metrics.system);
    }

    /**
     * Met à jour les métriques de temps de réponse
     */
    updateResponseTimeMetrics() {
        if (this.responseTimeSamples.length === 0) return;

        const sorted = [...this.responseTimeSamples].sort((a, b) => a - b);
        const sum = sorted.reduce((a, b) => a + b, 0);
        
        this.metrics.requests.responseTimeAvg = sum / sorted.length;
        this.metrics.requests.responseTimeP95 = sorted[Math.floor(sorted.length * 0.95)];
        this.metrics.requests.responseTimeP99 = sorted[Math.floor(sorted.length * 0.99)];
    }

    /**
     * Vérifie les seuils et génère des alertes
     */
    checkAlerts(endpoint, responseTime, statusCode) {
        const now = new Date();

        // Alerte temps de réponse
        if (responseTime > this.thresholds.responseTime) {
            this.addAlert('high_response_time', {
                endpoint,
                responseTime,
                threshold: this.thresholds.responseTime,
                severity: 'warning'
            });
        }

        // Alerte erreur
        if (statusCode >= 500) {
            this.addAlert('server_error', {
                endpoint,
                statusCode,
                severity: 'error'
            });
        }
    }

    /**
     * Vérifie les seuils système
     */
    checkSystemThresholds() {
        // Mémoire
        if (this.metrics.system.memoryUsage.percentage > this.thresholds.memoryUsage) {
            this.addAlert('high_memory_usage', {
                usage: this.metrics.system.memoryUsage.percentage,
                threshold: this.thresholds.memoryUsage,
                severity: 'warning'
            });
        }

        // CPU
        if (this.metrics.system.cpuUsage > this.thresholds.cpuUsage) {
            this.addAlert('high_cpu_usage', {
                usage: this.metrics.system.cpuUsage,
                threshold: this.thresholds.cpuUsage,
                severity: 'warning'
            });
        }

        // Taux d'erreur
        if (this.metrics.system.errorRate > this.thresholds.errorRate) {
            this.addAlert('high_error_rate', {
                rate: this.metrics.system.errorRate,
                threshold: this.thresholds.errorRate,
                severity: 'error'
            });
        }
    }

    /**
     * Ajoute une alerte
     */
    addAlert(type, data) {
        const alert = {
            id: `${type}_${Date.now()}`,
            type,
            data,
            timestamp: new Date(),
            acknowledged: false
        };

        this.alerts.push(alert);

        // Limiter le nombre d'alertes
        if (this.alerts.length > 1000) {
            this.alerts.shift();
        }

        this.emit('alert', alert);
        console.warn(`🚨 Alerte ${type}:`, data);
    }

    /**
     * Obtient toutes les métriques
     */
    getAllMetrics() {
        return {
            ...this.metrics,
            alerts: this.alerts.filter(alert => !alert.acknowledged),
            timestamp: new Date(),
            isCollecting: this.isCollecting
        };
    }

    /**
     * Obtient les métriques pour Prometheus
     */
    getPrometheusMetrics() {
        const metrics = [];
        
        // Métriques de requêtes
        metrics.push(`maya_requests_total ${this.metrics.requests.total}`);
        metrics.push(`maya_requests_success ${this.metrics.requests.success}`);
        metrics.push(`maya_requests_errors ${this.metrics.requests.errors}`);
        metrics.push(`maya_response_time_avg ${this.metrics.requests.responseTimeAvg}`);
        metrics.push(`maya_response_time_p95 ${this.metrics.requests.responseTimeP95}`);
        metrics.push(`maya_response_time_p99 ${this.metrics.requests.responseTimeP99}`);

        // Métriques de traduction
        metrics.push(`maya_translations_total ${this.metrics.translations.total}`);
        metrics.push(`maya_translations_cache_hits ${this.metrics.translations.cacheHits}`);
        metrics.push(`maya_translations_cache_misses ${this.metrics.translations.cacheMisses}`);
        metrics.push(`maya_translations_avg_confidence ${this.metrics.translations.avgConfidence}`);

        // Métriques système
        metrics.push(`maya_uptime_seconds ${this.metrics.system.uptime / 1000}`);
        metrics.push(`maya_memory_usage_percent ${this.metrics.system.memoryUsage.percentage || 0}`);
        metrics.push(`maya_cpu_usage_percent ${this.metrics.system.cpuUsage || 0}`);
        metrics.push(`maya_error_rate ${this.metrics.system.errorRate}`);

        // Métriques OAuth
        metrics.push(`maya_oauth_tokens_issued ${this.metrics.oauth.tokensIssued}`);
        metrics.push(`maya_oauth_tokens_active ${this.metrics.oauth.activeTokens}`);
        metrics.push(`maya_oauth_auth_failures ${this.metrics.oauth.authFailures}`);

        // Métriques business
        metrics.push(`maya_active_users ${this.metrics.business.activeUsers.size}`);

        return metrics.join('\n');
    }

    /**
     * Génère un rapport de santé
     */
    getHealthReport() {
        const now = new Date();
        const criticalAlerts = this.alerts.filter(alert => 
            alert.data.severity === 'error' && !alert.acknowledged
        );

        const health = {
            status: criticalAlerts.length > 0 ? 'unhealthy' : 'healthy',
            timestamp: now,
            uptime: this.metrics.system.uptime,
            metrics: {
                requests: {
                    total: this.metrics.requests.total,
                    errorRate: this.metrics.system.errorRate,
                    avgResponseTime: this.metrics.requests.responseTimeAvg
                },
                system: {
                    memoryUsage: this.metrics.system.memoryUsage.percentage,
                    cpuUsage: this.metrics.system.cpuUsage
                },
                translations: {
                    total: this.metrics.translations.total,
                    cacheHitRate: this.metrics.translations.total > 0 ? 
                        this.metrics.translations.cacheHits / this.metrics.translations.total : 0
                }
            },
            alerts: {
                total: this.alerts.length,
                critical: criticalAlerts.length,
                recent: this.alerts.filter(alert => 
                    now - alert.timestamp < 3600000 // dernière heure
                ).length
            }
        };

        return health;
    }

    /**
     * Acquitte une alerte
     */
    acknowledgeAlert(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.acknowledged = true;
            alert.acknowledgedAt = new Date();
            this.emit('alertAcknowledged', alert);
        }
    }

    /**
     * Nettoyage des métriques anciennes
     */
    cleanupOldMetrics() {
        const now = new Date();
        const oneDayAgo = now.getTime() - 24 * 60 * 60 * 1000;

        // Nettoyer les alertes anciennes
        this.alerts = this.alerts.filter(alert => 
            alert.timestamp.getTime() > oneDayAgo
        );

        // Réinitialiser les utilisateurs actifs
        this.metrics.business.activeUsers.clear();

        console.log('🧹 Nettoyage des métriques anciennes effectué');
    }

    /**
     * Arrête la collecte de métriques
     */
    stop() {
        if (this.systemMetricsInterval) {
            clearInterval(this.systemMetricsInterval);
        }
        
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }

        this.isCollecting = false;
        console.log('⏹️  Service de monitoring arrêté');
    }

    /**
     * Exporte les métriques vers un fichier
     */
    async exportMetrics(format = 'json') {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `metrics_${timestamp}.${format}`;
        
        let data;
        if (format === 'json') {
            data = JSON.stringify(this.getAllMetrics(), null, 2);
        } else if (format === 'prometheus') {
            data = this.getPrometheusMetrics();
        }

        // En production, sauvegarder sur S3, GCS, etc.
        console.log(`📊 Métriques exportées: ${filename}`);
        return { filename, data };
    }
}

export default MonitoringService;
