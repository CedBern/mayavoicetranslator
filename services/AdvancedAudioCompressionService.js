/**
 * 🎵 SERVICE COMPRESSION AUDIO AVANCÉE - TALK KIN
 * Algorithmes adaptatifs pour qualité optimale et taille minimale
 * Préservation qualité linguistique critique
 */

class AdvancedAudioCompressionService {
    constructor() {
        this.compressionProfiles = {
            'linguistic-analysis': {
                algorithm: 'flac',
                quality: 100,
                preserveFrequencies: [80, 8000], // Préservation complète spectre vocal
                lossless: true,
                purpose: 'Analyse linguistique précise'
            },
            'voice-synthesis': {
                algorithm: 'opus',
                bitrate: 64000,
                quality: 85,
                preserveFrequencies: [85, 7000],
                latency: 'ultra-low',
                purpose: 'Synthèse vocale temps réel'
            },
            'learning-content': {
                algorithm: 'aac-he-v2',
                bitrate: 48000,
                quality: 80,
                preserveFrequencies: [90, 6500],
                stereo: false,
                purpose: 'Contenu apprentissage optimisé'
            },
            'corpus-storage': {
                algorithm: 'vorbis',
                quality: 75,
                variableBitrate: true,
                preserveFrequencies: [100, 6000],
                compression: 0.25,
                purpose: 'Stockage corpus volumineux'
            },
            'offline-mobile': {
                algorithm: 'amr-wb',
                bitrate: 23850,
                quality: 70,
                preserveFrequencies: [150, 5500],
                lowPower: true,
                purpose: 'Usage mobile hors ligne'
            },
            'ancient-languages': {
                algorithm: 'flac',
                quality: 100,
                preserveFrequencies: [50, 10000], // Spectre étendu pour nuances anciennes
                metadata: 'extensive',
                purpose: 'Préservation langues anciennes'
            }
        };

        this.adaptiveSettings = {
            bandwidth: {
                'high': 'linguistic-analysis',
                'medium': 'voice-synthesis',
                'low': 'offline-mobile',
                'variable': 'adaptive'
            },
            device: {
                'desktop': 'voice-synthesis',
                'mobile-modern': 'learning-content',
                'mobile-legacy': 'offline-mobile',
                'embedded': 'corpus-storage'
            },
            usage: {
                'real-time': 'voice-synthesis',
                'learning': 'learning-content',
                'analysis': 'linguistic-analysis',
                'storage': 'corpus-storage',
                'preservation': 'ancient-languages'
            }
        };

        this.qualityMetrics = {
            'mse': 0, // Mean Squared Error
            'snr': 0, // Signal-to-Noise Ratio
            'pesq': 0, // Perceptual Evaluation Speech Quality
            'stoi': 0, // Short-Time Objective Intelligibility
            'linguistic_preservation': 0 // Métrique custom préservation linguistique
        };

        this.init();
    }

    async init() {
        console.log('🎵 Initialisation Compression Audio Avancée...');
        await this.loadCompressionLibraries();
        await this.calibrateQualityThresholds();
        await this.setupAdaptiveEngine();
        console.log('✅ Compression Audio opérationnelle');
    }

    /**
     * 🔧 Chargement bibliothèques compression
     */
    async loadCompressionLibraries() {
        const libraries = {
            'opus': await import('opus-media-recorder'),
            'flac': await import('flac.js'),
            'aac': await import('aac-encoder'),
            'vorbis': await import('vorbis-encoder')
        };

        this.encoders = libraries;
        console.log('📚 Bibliothèques compression chargées');
    }

    /**
     * 🎯 Compression adaptative intelligente
     */
    async compressAudio(audioBuffer, context = {}) {
        // Analyse contexte pour sélection profil optimal
        const optimalProfile = await this.selectOptimalProfile(audioBuffer, context);
        
        // Analyse qualité audio source
        const sourceQuality = await this.analyzeSourceQuality(audioBuffer);
        
        // Ajustement paramètres selon qualité source
        const adjustedProfile = await this.adjustProfileForSource(optimalProfile, sourceQuality);
        
        // Compression avec monitoring qualité
        const compressedAudio = await this.performCompression(audioBuffer, adjustedProfile);
        
        // Validation qualité post-compression
        const qualityAssessment = await this.assessCompressionQuality(
            audioBuffer, 
            compressedAudio, 
            adjustedProfile
        );
        
        return {
            audio: compressedAudio,
            profile: adjustedProfile,
            quality: qualityAssessment,
            compressionRatio: audioBuffer.byteLength / compressedAudio.byteLength,
            metadata: this.generateCompressionMetadata(adjustedProfile, qualityAssessment)
        };
    }

    async selectOptimalProfile(audioBuffer, context) {
        let scores = {};
        
        // Score basé sur contexte d'usage
        if (context.usage) {
            const usageProfile = this.adaptiveSettings.usage[context.usage];
            if (usageProfile) scores[usageProfile] = (scores[usageProfile] || 0) + 0.4;
        }
        
        // Score basé sur device
        if (context.device) {
            const deviceProfile = this.adaptiveSettings.device[context.device];
            if (deviceProfile) scores[deviceProfile] = (scores[deviceProfile] || 0) + 0.3;
        }
        
        // Score basé sur bandwidth
        if (context.bandwidth) {
            const bandwidthProfile = this.adaptiveSettings.bandwidth[context.bandwidth];
            if (bandwidthProfile) scores[bandwidthProfile] = (scores[bandwidthProfile] || 0) + 0.2;
        }
        
        // Analyse audio pour recommandation profil
        const audioCharacteristics = await this.analyzeAudioCharacteristics(audioBuffer);
        if (audioCharacteristics.hasAncientLanguageMarkers) {
            scores['ancient-languages'] = (scores['ancient-languages'] || 0) + 0.5;
        }
        
        // Sélection profil avec score maximal
        const bestProfile = Object.keys(scores).reduce((a, b) => 
            scores[a] > scores[b] ? a : b
        );
        
        return this.compressionProfiles[bestProfile] || this.compressionProfiles['voice-synthesis'];
    }

    async analyzeSourceQuality(audioBuffer) {
        const audioContext = new AudioContext();
        const audioData = await audioContext.decodeAudioData(audioBuffer.slice());
        
        // Analyse spectrale
        const spectralAnalysis = await this.performSpectralAnalysis(audioData);
        
        // Détection noise floor
        const noiseFloor = await this.detectNoiseFloor(audioData);
        
        // Analyse dynamique range
        const dynamicRange = await this.analyzeDynamicRange(audioData);
        
        // Détection caractéristiques linguistiques
        const linguisticFeatures = await this.detectLinguisticFeatures(audioData);
        
        return {
            sampleRate: audioData.sampleRate,
            channels: audioData.numberOfChannels,
            duration: audioData.duration,
            spectralCentroid: spectralAnalysis.centroid,
            spectralBandwidth: spectralAnalysis.bandwidth,
            noiseFloor: noiseFloor,
            dynamicRange: dynamicRange,
            linguisticComplexity: linguisticFeatures.complexity,
            frequencyDistribution: spectralAnalysis.distribution
        };
    }

    async adjustProfileForSource(profile, sourceQuality) {
        const adjustedProfile = { ...profile };
        
        // Ajustement bitrate selon qualité source
        if (sourceQuality.noiseFloor > -40) {
            // Source bruitée - réduction bitrate pour éviter amplification bruit
            adjustedProfile.bitrate = Math.min(adjustedProfile.bitrate, 32000);
        }
        
        // Ajustement fréquences selon contenu spectral
        if (sourceQuality.spectralCentroid > 3000) {
            // Contenu riche en hautes fréquences
            adjustedProfile.preserveFrequencies[1] = Math.min(
                adjustedProfile.preserveFrequencies[1] + 1000,
                8000
            );
        }
        
        // Ajustement qualité selon complexité linguistique
        if (sourceQuality.linguisticComplexity > 0.8) {
            adjustedProfile.quality = Math.min(adjustedProfile.quality + 10, 100);
        }
        
        return adjustedProfile;
    }

    async performCompression(audioBuffer, profile) {
        const encoder = this.getEncoderForProfile(profile);
        
        try {
            // Configuration encoder selon profil
            await this.configureEncoder(encoder, profile);
            
            // Compression avec monitoring
            const compressedData = await encoder.encode(audioBuffer);
            
            return compressedData;
        } catch (error) {
            console.error('❌ Erreur compression:', error);
            // Fallback vers profil sécurisé
            return this.performFallbackCompression(audioBuffer);
        }
    }

    getEncoderForProfile(profile) {
        const algorithmMap = {
            'opus': this.encoders.opus,
            'flac': this.encoders.flac,
            'aac-he': this.encoders.aac,
            'aac-he-v2': this.encoders.aac,
            'vorbis': this.encoders.vorbis,
            'amr-wb': this.encoders.amr
        };
        
        return algorithmMap[profile.algorithm] || this.encoders.opus;
    }

    async configureEncoder(encoder, profile) {
        const config = {
            bitrate: profile.bitrate,
            quality: profile.quality,
            channels: profile.stereo ? 2 : 1,
            sampleRate: 48000,
            frameSize: profile.latency === 'ultra-low' ? 480 : 960
        };
        
        // Configuration spécifique selon algorithme
        if (profile.algorithm === 'opus') {
            config.application = 'voip';
            config.complexity = 10;
            config.vbr = true;
        } else if (profile.algorithm === 'flac') {
            config.compressionLevel = 8;
            config.verify = true;
        }
        
        await encoder.configure(config);
    }

    /**
     * 📊 Évaluation qualité compression
     */
    async assessCompressionQuality(original, compressed, profile) {
        // Décompression pour comparaison
        const decompressed = await this.decompressForAnalysis(compressed, profile);
        
        // Calcul métriques qualité
        const mse = await this.calculateMSE(original, decompressed);
        const snr = await this.calculateSNR(original, decompressed);
        const pesq = await this.calculatePESQ(original, decompressed);
        const stoi = await this.calculateSTOI(original, decompressed);
        const linguisticPreservation = await this.assessLinguisticPreservation(original, decompressed);
        
        const qualityScore = this.calculateOverallQualityScore({
            mse, snr, pesq, stoi, linguisticPreservation
        });
        
        return {
            mse,
            snr,
            pesq,
            stoi,
            linguisticPreservation,
            overallScore: qualityScore,
            acceptableQuality: qualityScore > 0.75
        };
    }

    async calculateMSE(original, compressed) {
        // Calcul Mean Squared Error
        const originalSamples = await this.extractSamples(original);
        const compressedSamples = await this.extractSamples(compressed);
        
        let mse = 0;
        const length = Math.min(originalSamples.length, compressedSamples.length);
        
        for (let i = 0; i < length; i++) {
            const diff = originalSamples[i] - compressedSamples[i];
            mse += diff * diff;
        }
        
        return mse / length;
    }

    async assessLinguisticPreservation(original, compressed) {
        // Analyse préservation caractéristiques linguistiques critiques
        const originalFeatures = await this.extractLinguisticFeatures(original);
        const compressedFeatures = await this.extractLinguisticFeatures(compressed);
        
        // Comparaison formants
        const formantPreservation = this.compareFormants(
            originalFeatures.formants, 
            compressedFeatures.formants
        );
        
        // Comparaison pitch
        const pitchPreservation = this.comparePitch(
            originalFeatures.pitch,
            compressedFeatures.pitch
        );
        
        // Comparaison consonnes/voyelles
        const phoneticPreservation = this.comparePhoneticFeatures(
            originalFeatures.phonetic,
            compressedFeatures.phonetic
        );
        
        return (formantPreservation + pitchPreservation + phoneticPreservation) / 3;
    }

    /**
     * 🔄 Compression adaptative temps réel
     */
    startAdaptiveCompression() {
        this.adaptiveEngine = {
            monitoring: true,
            adjustmentInterval: 5000,
            qualityTarget: 0.8,
            bandwidthTarget: 64000
        };
        
        setInterval(async () => {
            await this.adaptCompressionSettings();
        }, this.adaptiveEngine.adjustmentInterval);
    }

    async adaptCompressionSettings() {
        // Collecte métriques performance
        const metrics = await this.collectPerformanceMetrics();
        
        // Ajustement selon métriques
        if (metrics.qualityScore < this.adaptiveEngine.qualityTarget) {
            await this.increaseQualitySettings();
        }
        
        if (metrics.bandwidthUsage > this.adaptiveEngine.bandwidthTarget) {
            await this.optimizeBandwidthUsage();
        }
        
        console.log(`🔄 Paramètres compression adaptés - Qualité: ${metrics.qualityScore}, Bande passante: ${metrics.bandwidthUsage}`);
    }

    /**
     * 🎯 Optimisations spécialisées
     */
    async optimizeForLanguageFamily(audioBuffer, languageFamily) {
        const optimizations = {
            'sino-tibetan': {
                tonePreservation: true,
                pitchRange: [80, 400],
                frequencyEmphasis: [200, 2000]
            },
            'afroasiatic': {
                pharyngealPreservation: true,
                frequencyEmphasis: [100, 3000],
                gutturalEnhancement: true
            },
            'indo-european': {
                consonantClarity: true,
                vowelPreservation: true,
                frequencyEmphasis: [150, 4000]
            },
            'austronesian': {
                nasalPreservation: true,
                frequencyEmphasis: [120, 3500],
                rhythmPreservation: true
            }
        };
        
        const optimization = optimizations[languageFamily];
        if (!optimization) return this.compressAudio(audioBuffer);
        
        // Application optimisations spécifiques
        const customProfile = this.createCustomProfile(optimization);
        return this.compressAudio(audioBuffer, { customProfile });
    }

    /**
     * 📈 Métriques et monitoring
     */
    async generateCompressionReport() {
        const report = {
            sessionsAnalyzed: this.sessionsCount,
            averageCompressionRatio: this.averageCompressionRatio,
            averageQualityScore: this.averageQualityScore,
            profileUsageStats: this.profileUsageStats,
            languageFamilyOptimizations: this.languageOptimizations,
            performanceMetrics: await this.getPerformanceMetrics(),
            recommendations: await this.generateOptimizationRecommendations()
        };
        
        return report;
    }

    // Méthodes utilitaires
    async performSpectralAnalysis(audioData) {
        // Implémentation analyse spectrale
        return {
            centroid: 2000,
            bandwidth: 4000,
            distribution: new Float32Array(1024)
        };
    }

    async detectNoiseFloor(audioData) {
        // Détection niveau bruit de fond
        return -50; // dB
    }

    async analyzeDynamicRange(audioData) {
        // Analyse plage dynamique
        return 60; // dB
    }

    async detectLinguisticFeatures(audioData) {
        // Détection caractéristiques linguistiques
        return {
            complexity: 0.7,
            hasAncientLanguageMarkers: false
        };
    }

    calculateOverallQualityScore(metrics) {
        const weights = {
            mse: -0.2,
            snr: 0.25,
            pesq: 0.25,
            stoi: 0.2,
            linguisticPreservation: 0.3
        };
        
        let score = 0;
        for (const [metric, weight] of Object.entries(weights)) {
            score += metrics[metric] * weight;
        }
        
        return Math.max(0, Math.min(1, score));
    }

    generateCompressionMetadata(profile, quality) {
        return {
            algorithm: profile.algorithm,
            quality: profile.quality,
            preservationScore: quality.linguisticPreservation,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
    }
}

// Service global singleton
window.AdvancedAudioCompressionService = new AdvancedAudioCompressionService();

export default AdvancedAudioCompressionService;
