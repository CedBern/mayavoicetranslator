/**
 * 🔐 Service d'authentification OAuth2 pour l'API REST
 * Gestion complète de l'authentification et de l'autorisation
 */

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ConfigurationManager } from './ConfigurationManager.js';

export class OAuth2Service {
    constructor() {
        this.config = new ConfigurationManager();
        
        // Configuration OAuth2
        this.clientCredentials = new Map();
        this.authorizationCodes = new Map();
        this.accessTokens = new Map();
        this.refreshTokens = new Map();
        
        // Paramètres de sécurité
        this.jwtSecret = process.env.JWT_SECRET || this.generateSecretKey();
        this.tokenExpiration = 3600; // 1 heure
        this.refreshTokenExpiration = 86400 * 7; // 7 jours
        this.codeExpiration = 600; // 10 minutes
        
        this.initializeDefaultClients();
    }

    /**
     * Initialise les clients par défaut
     */
    initializeDefaultClients() {
        // Client pour le SDK JavaScript
        this.registerClient({
            clientId: 'maya-sdk-js',
            clientSecret: '<YOUR_CLIENT_SECRET_HERE>',
            name: 'Maya Translator JavaScript SDK',
            redirectUris: ['http://localhost:3000/callback', 'https://app.mayatranslator.com/callback'],
            grantTypes: ['authorization_code', 'client_credentials', 'refresh_token'],
            scopes: ['translate', 'voice', 'dictionary', 'search']
        });

        // Client pour les applications mobiles
        this.registerClient({
            clientId: 'maya-mobile-app',
            clientSecret: '<YOUR_CLIENT_SECRET_HERE>',
            name: 'Maya Translator Mobile App',
            redirectUris: ['mayatranslator://callback'],
            grantTypes: ['authorization_code', 'refresh_token'],
            scopes: ['translate', 'voice', 'dictionary', 'search', 'offline']
        });

        // Client pour les intégrations tiers
        this.registerClient({
            clientId: 'maya-api-client',
            clientSecret: '<YOUR_CLIENT_SECRET_HERE>',
            name: 'Maya Translator API Client',
            redirectUris: [],
            grantTypes: ['client_credentials'],
            scopes: ['translate', 'dictionary', 'search']
        });
    }

    /**
     * Enregistre un nouveau client OAuth2
     */
    registerClient(clientData) {
        const client = {
            clientId: clientData.clientId,
            clientSecret: clientData.clientSecret,
            name: clientData.name,
            redirectUris: clientData.redirectUris || [],
            grantTypes: clientData.grantTypes || ['authorization_code'],
            scopes: clientData.scopes || ['translate'],
            createdAt: new Date(),
            isActive: true
        };

        this.clientCredentials.set(client.clientId, client);
        console.log(`📝 Client OAuth2 enregistré: ${client.name} (${client.clientId})`);
        
        return {
            success: true,
            clientId: client.clientId,
            message: 'Client enregistré avec succès'
        };
    }

    /**
     * Valide les credentials d'un client
     */
    validateClient(clientId, clientSecret = null) {
        const client = this.clientCredentials.get(clientId);
        
        if (!client || !client.isActive) {
            return { valid: false, error: 'Client non trouvé ou inactif' };
        }

        if (clientSecret && client.clientSecret !== clientSecret) {
            return { valid: false, error: 'Secret client invalide' };
        }

        return { valid: true, client };
    }

    /**
     * Génère un code d'autorisation (Authorization Code Flow)
     */
    generateAuthorizationCode(clientId, userId, scopes, redirectUri) {
        const validation = this.validateClient(clientId);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        const client = validation.client;
        
        // Vérification de l'URI de redirection
        if (!client.redirectUris.includes(redirectUri)) {
            throw new Error('URI de redirection non autorisée');
        }

        // Vérification des scopes
        const requestedScopes = scopes.split(' ');
        const unauthorizedScopes = requestedScopes.filter(scope => !client.scopes.includes(scope));
        if (unauthorizedScopes.length > 0) {
            throw new Error(`Scopes non autorisés: ${unauthorizedScopes.join(', ')}`);
        }

        const code = this.generateRandomString(32);
        const authCode = {
            code,
            clientId,
            userId,
            scopes: requestedScopes,
            redirectUri,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + this.codeExpiration * 1000)
        };

        this.authorizationCodes.set(code, authCode);

        // Nettoyage automatique des codes expirés
        setTimeout(() => {
            this.authorizationCodes.delete(code);
        }, this.codeExpiration * 1000);

        return {
            code,
            expiresIn: this.codeExpiration,
            redirectUri: `${redirectUri}?code=${code}&state=${this.generateRandomString(16)}`
        };
    }

    /**
     * Échange un code d'autorisation contre un token d'accès
     */
    exchangeCodeForToken(code, clientId, clientSecret, redirectUri) {
        const validation = this.validateClient(clientId, clientSecret);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        const authCode = this.authorizationCodes.get(code);
        if (!authCode) {
            throw new Error('Code d\'autorisation invalide');
        }

        if (authCode.expiresAt < new Date()) {
            this.authorizationCodes.delete(code);
            throw new Error('Code d\'autorisation expiré');
        }

        if (authCode.clientId !== clientId || authCode.redirectUri !== redirectUri) {
            throw new Error('Paramètres du code d\'autorisation invalides');
        }

        // Suppression du code utilisé
        this.authorizationCodes.delete(code);

        // Génération des tokens
        const tokens = this.generateTokens(authCode.userId, authCode.clientId, authCode.scopes);

        return {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            token_type: 'Bearer',
            expires_in: this.tokenExpiration,
            scope: authCode.scopes.join(' ')
        };
    }

    /**
     * Client Credentials Flow (pour les applications serveur-à-serveur)
     */
    clientCredentialsGrant(clientId, clientSecret, scopes = 'translate') {
        const validation = this.validateClient(clientId, clientSecret);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        const client = validation.client;
        
        if (!client.grantTypes.includes('client_credentials')) {
            throw new Error('Grant type non autorisé pour ce client');
        }

        const requestedScopes = scopes.split(' ');
        const unauthorizedScopes = requestedScopes.filter(scope => !client.scopes.includes(scope));
        if (unauthorizedScopes.length > 0) {
            throw new Error(`Scopes non autorisés: ${unauthorizedScopes.join(', ')}`);
        }

        const tokens = this.generateTokens(null, clientId, requestedScopes);

        return {
            access_token: tokens.accessToken,
            token_type: 'Bearer',
            expires_in: this.tokenExpiration,
            scope: requestedScopes.join(' ')
        };
    }

    /**
     * Rafraîchissement d'un token d'accès
     */
    refreshAccessToken(refreshToken, clientId, clientSecret) {
        const validation = this.validateClient(clientId, clientSecret);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        const tokenData = this.refreshTokens.get(refreshToken);
        if (!tokenData) {
            throw new Error('Refresh token invalide');
        }

        if (tokenData.expiresAt < new Date()) {
            this.refreshTokens.delete(refreshToken);
            throw new Error('Refresh token expiré');
        }

        if (tokenData.clientId !== clientId) {
            throw new Error('Client non autorisé pour ce refresh token');
        }

        // Suppression de l'ancien refresh token
        this.refreshTokens.delete(refreshToken);

        // Génération de nouveaux tokens
        const tokens = this.generateTokens(tokenData.userId, clientId, tokenData.scopes);

        return {
            access_token: tokens.accessToken,
            refresh_token: tokens.refreshToken,
            token_type: 'Bearer',
            expires_in: this.tokenExpiration,
            scope: tokenData.scopes.join(' ')
        };
    }

    /**
     * Génère un access token et un refresh token
     */
    generateTokens(userId, clientId, scopes) {
        const tokenId = this.generateRandomString(32);
        const refreshTokenId = this.generateRandomString(32);

        // Payload du JWT
        const payload = {
            jti: tokenId,
            sub: userId,
            aud: clientId,
            scope: scopes.join(' '),
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + this.tokenExpiration
        };

        const accessToken = jwt.sign(payload, this.jwtSecret);

        // Stockage des métadonnées du token
        const tokenData = {
            tokenId,
            userId,
            clientId,
            scopes,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + this.tokenExpiration * 1000),
            lastUsed: new Date()
        };

        const refreshTokenData = {
            refreshTokenId,
            userId,
            clientId,
            scopes,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + this.refreshTokenExpiration * 1000)
        };

        this.accessTokens.set(tokenId, tokenData);
        this.refreshTokens.set(refreshTokenId, refreshTokenData);

        // Nettoyage automatique
        setTimeout(() => {
            this.accessTokens.delete(tokenId);
        }, this.tokenExpiration * 1000);

        setTimeout(() => {
            this.refreshTokens.delete(refreshTokenId);
        }, this.refreshTokenExpiration * 1000);

        return {
            accessToken,
            refreshToken: refreshTokenId
        };
    }

    /**
     * Valide un token d'accès
     */
    validateAccessToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            const tokenData = this.accessTokens.get(decoded.jti);

            if (!tokenData) {
                return { valid: false, error: 'Token non trouvé' };
            }

            if (tokenData.expiresAt < new Date()) {
                this.accessTokens.delete(decoded.jti);
                return { valid: false, error: 'Token expiré' };
            }

            // Mise à jour de la dernière utilisation
            tokenData.lastUsed = new Date();

            return {
                valid: true,
                payload: decoded,
                tokenData,
                scopes: tokenData.scopes,
                userId: tokenData.userId,
                clientId: tokenData.clientId
            };

        } catch (error) {
            return { valid: false, error: 'Token invalide' };
        }
    }

    /**
     * Révoque un token d'accès
     */
    revokeToken(token, clientId, clientSecret) {
        const validation = this.validateClient(clientId, clientSecret);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        try {
            const decoded = jwt.verify(token, this.jwtSecret, { ignoreExpiration: true });
            
            if (decoded.aud !== clientId) {
                throw new Error('Client non autorisé à révoquer ce token');
            }

            // Suppression du token et du refresh token associé
            this.accessTokens.delete(decoded.jti);
            
            // Suppression des refresh tokens associés
            for (const [refreshTokenId, refreshTokenData] of this.refreshTokens.entries()) {
                if (refreshTokenData.clientId === clientId && refreshTokenData.userId === decoded.sub) {
                    this.refreshTokens.delete(refreshTokenId);
                }
            }

            return { success: true, message: 'Token révoqué avec succès' };

        } catch (error) {
            throw new Error('Impossible de révoquer le token');
        }
    }

    /**
     * Middleware Express pour vérifier les permissions
     */
    requireScope(requiredScope) {
        return (req, res, next) => {
            const authorization = req.headers.authorization;
            if (!authorization || !authorization.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'Token d\'accès requis' });
            }

            const token = authorization.substring(7);
            const validation = this.validateAccessToken(token);

            if (!validation.valid) {
                return res.status(401).json({ error: validation.error });
            }

            if (!validation.scopes.includes(requiredScope)) {
                return res.status(403).json({ 
                    error: 'Scope insuffisant',
                    required: requiredScope,
                    available: validation.scopes
                });
            }

            req.oauth = {
                userId: validation.userId,
                clientId: validation.clientId,
                scopes: validation.scopes,
                tokenData: validation.tokenData
            };

            next();
        };
    }

    /**
     * Obtenir les informations d'un token
     */
    introspectToken(token, clientId, clientSecret) {
        const validation = this.validateClient(clientId, clientSecret);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        const tokenValidation = this.validateAccessToken(token);

        if (!tokenValidation.valid) {
            return {
                active: false
            };
        }

        return {
            active: true,
            client_id: tokenValidation.clientId,
            username: tokenValidation.userId,
            scope: tokenValidation.scopes.join(' '),
            exp: Math.floor(tokenValidation.tokenData.expiresAt.getTime() / 1000),
            iat: Math.floor(tokenValidation.tokenData.createdAt.getTime() / 1000)
        };
    }

    /**
     * Obtenir les statistiques d'utilisation OAuth2
     */
    getOAuthStats() {
        const now = new Date();
        const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        const activeTokens = Array.from(this.accessTokens.values())
            .filter(token => token.expiresAt > now);

        const recentTokens = activeTokens
            .filter(token => token.lastUsed > hourAgo);

        return {
            totalClients: this.clientCredentials.size,
            activeTokens: activeTokens.length,
            recentActiveTokens: recentTokens.length,
            totalRefreshTokens: this.refreshTokens.size,
            pendingAuthCodes: this.authorizationCodes.size,
            topClients: this.getTopClients(),
            timestamp: now.toISOString()
        };
    }

    /**
     * Obtient les clients les plus actifs
     */
    getTopClients() {
        const clientUsage = new Map();

        for (const token of this.accessTokens.values()) {
            const count = clientUsage.get(token.clientId) || 0;
            clientUsage.set(token.clientId, count + 1);
        }

        return Array.from(clientUsage.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([clientId, count]) => ({
                clientId,
                count,
                name: this.clientCredentials.get(clientId)?.name || 'Unknown'
            }));
    }

    /**
     * Nettoyage des tokens expirés
     */
    cleanupExpiredTokens() {
        const now = new Date();
        let cleanedCount = 0;

        // Nettoyage des access tokens
        for (const [tokenId, tokenData] of this.accessTokens.entries()) {
            if (tokenData.expiresAt < now) {
                this.accessTokens.delete(tokenId);
                cleanedCount++;
            }
        }

        // Nettoyage des refresh tokens
        for (const [refreshTokenId, refreshTokenData] of this.refreshTokens.entries()) {
            if (refreshTokenData.expiresAt < now) {
                this.refreshTokens.delete(refreshTokenId);
                cleanedCount++;
            }
        }

        // Nettoyage des codes d'autorisation
        for (const [code, authCode] of this.authorizationCodes.entries()) {
            if (authCode.expiresAt < now) {
                this.authorizationCodes.delete(code);
                cleanedCount++;
            }
        }

        if (cleanedCount > 0) {
            console.log(`🧹 Nettoyage OAuth2: ${cleanedCount} tokens expirés supprimés`);
        }

        return cleanedCount;
    }

    /**
     * Génère une clé secrète aléatoire
     */
    generateSecretKey() {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Génère une chaîne aléatoire
     */
    generateRandomString(length) {
        return crypto.randomBytes(length).toString('hex').substring(0, length);
    }

    /**
     * Démarre le nettoyage automatique des tokens expirés
     */
    startAutomaticCleanup() {
        // Nettoyage toutes les heures
        this.cleanupInterval = setInterval(() => {
            this.cleanupExpiredTokens();
        }, 60 * 60 * 1000);

        console.log('🔄 Nettoyage automatique OAuth2 démarré (toutes les heures)');
    }

    /**
     * Arrête le nettoyage automatique
     */
    stopAutomaticCleanup() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
            console.log('⏹️  Nettoyage automatique OAuth2 arrêté');
        }
    }
}

export default OAuth2Service;
