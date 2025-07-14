/**
 * 🌟 Service de Crowdsourcing et Traduction Humaine
 * Plateforme collaborative pour améliorer les traductions avec l'aide de la communauté
 */

class CrowdsourcingTranslationService {
  constructor() {
    this.contributors = new Map();
    this.pendingTranslations = new Map();
    this.validatedTranslations = new Map();
    this.reviewQueue = [];
    
    // Système de réputation et gamification
    this.reputationSystem = {
      levels: {
        'novice': { min: 0, max: 100, permissions: ['translate', 'suggest'] },
        'apprentice': { min: 101, max: 500, permissions: ['translate', 'suggest', 'review_basic'] },
        'expert': { min: 501, max: 2000, permissions: ['translate', 'suggest', 'review_basic', 'review_advanced'] },
        'master': { min: 2001, max: 10000, permissions: ['translate', 'suggest', 'review_basic', 'review_advanced', 'moderate'] },
        'elder': { min: 10001, max: Infinity, permissions: ['all'] }
      },
      badges: {
        'first_translation': { name: 'Premier Traducteur', points: 10 },
        'audio_contributor': { name: 'Voix Ancestrale', points: 25 },
        'cultural_expert': { name: 'Gardien Culturel', points: 50 },
        'community_leader': { name: 'Guide Communautaire', points: 100 },
        'language_master': { name: 'Maître Linguiste', points: 200 }
      }
    };

    // Configuration des langues et dialectes
    this.languageConfig = {
      'yua': {
        name: 'Maya Yucatèque',
        variants: ['Yucatán', 'Campeche', 'Quintana Roo'],
        expertCommunities: ['Maní', 'Valladolid', 'Felipe Carrillo Puerto'],
        culturalContexts: ['ceremonial', 'daily', 'agricultural', 'astronomical'],
        priority: 'high'
      },
      'qu': {
        name: 'Quechua',
        variants: ['Cusco', 'Ayacucho', 'Ancash', 'Boliviano', 'Ecuatoriano'],
        expertCommunities: ['Pisac', 'Ollantaytambo', 'Chinchero'],
        culturalContexts: ['ceremonial', 'agricultural', 'textile', 'musical'],
        priority: 'high'
      },
      'nah': {
        name: 'Nahuatl',
        variants: ['Central', 'Huasteco', 'Oriental', 'Guerrero'],
        expertCommunities: ['Milpa Alta', 'Tepoztlán', 'Hueyapan'],
        culturalContexts: ['ceremonial', 'medicinal', 'poetic', 'historical'],
        priority: 'medium'
      },
      'gn': {
        name: 'Guarani',
        variants: ['Paraguayo', 'Boliviano', 'Argentino'],
        expertCommunities: ['Asunción', 'Ciudad del Este', 'Encarnación'],
        culturalContexts: ['daily', 'spiritual', 'ecological', 'political'],
        priority: 'medium'
      }
    };

    this.translationCategories = {
      'basic': {
        name: 'Vocabulaire de base',
        examples: ['salutations', 'nombres', 'couleurs', 'famille'],
        requiredLevel: 'novice',
        reviewsNeeded: 2
      },
      'intermediate': {
        name: 'Expressions courantes',
        examples: ['conversations', 'directions', 'nourriture', 'temps'],
        requiredLevel: 'apprentice',
        reviewsNeeded: 3
      },
      'advanced': {
        name: 'Contexte culturel',
        examples: ['cérémonies', 'traditions', 'métaphores', 'proverbes'],
        requiredLevel: 'expert',
        reviewsNeeded: 4
      },
      'specialized': {
        name: 'Domaines spécialisés',
        examples: ['médecine traditionnelle', 'astronomie', 'agriculture', 'rituels'],
        requiredLevel: 'master',
        reviewsNeeded: 5
      }
    };
  }

  /**
   * Enregistrement d'un nouveau contributeur
   */
  async registerContributor(userData) {
    const contributor = {
      id: this.generateContributorId(),
      ...userData,
      joinDate: new Date().toISOString(),
      reputation: {
        points: 0,
        level: 'novice',
        badges: [],
        contributions: {
          translations: 0,
          reviews: 0,
          audio: 0,
          cultural_notes: 0
        }
      },
      languages: {
        native: userData.nativeLanguages || [],
        fluent: userData.fluentLanguages || [],
        learning: userData.learningLanguages || []
      },
      expertise: {
        regions: userData.culturalRegions || [],
        contexts: userData.culturalContexts || [],
        specializations: userData.specializations || []
      },
      status: 'active',
      lastActivity: new Date().toISOString()
    };

    this.contributors.set(contributor.id, contributor);
    
    console.log(`👋 Nouveau contributeur enregistré: ${contributor.name} (${contributor.id})`);
    
    // Attribution du badge de bienvenue
    await this.awardBadge(contributor.id, 'first_translation');
    
    return contributor;
  }

  /**
   * Soumission d'une nouvelle traduction par la communauté
   */
  async submitTranslation(contributorId, translationData) {
    const contributor = this.contributors.get(contributorId);
    if (!contributor) {
      throw new Error('Contributeur non trouvé');
    }

    // Vérifier les permissions
    if (!this.hasPermission(contributor, 'translate')) {
      throw new Error('Permissions insuffisantes pour traduire');
    }

    const translation = {
      id: this.generateTranslationId(),
      contributorId: contributorId,
      sourceText: translationData.sourceText,
      targetText: translationData.targetText,
      sourceLanguage: translationData.sourceLanguage,
      targetLanguage: translationData.targetLanguage,
      category: translationData.category || 'basic',
      culturalContext: translationData.culturalContext || 'daily',
      region: translationData.region || 'general',
      confidence: contributorId.confidence || 0.8,
      metadata: {
        submitTime: new Date().toISOString(),
        difficulty: this.assessDifficulty(translationData),
        culturalNotes: translationData.culturalNotes || '',
        pronunciationNotes: translationData.pronunciationNotes || '',
        usage_examples: translationData.usageExamples || []
      },
      status: 'pending_review',
      reviews: [],
      votes: { up: 0, down: 0 }
    };

    this.pendingTranslations.set(translation.id, translation);
    
    // Ajouter à la queue de révision
    this.addToReviewQueue(translation);
    
    // Mettre à jour les statistiques du contributeur
    contributor.reputation.contributions.translations++;
    contributor.lastActivity = new Date().toISOString();
    
    console.log(`📝 Nouvelle traduction soumise: "${translation.sourceText}" → "${translation.targetText}" (${translation.sourceLanguage} → ${translation.targetLanguage})`);
    
    return translation;
  }

  /**
   * Processus de révision collaborative
   */
  async reviewTranslation(reviewerId, translationId, reviewData) {
    const reviewer = this.contributors.get(reviewerId);
    const translation = this.pendingTranslations.get(translationId);
    
    if (!reviewer || !translation) {
      throw new Error('Réviseur ou traduction non trouvé');
    }

    // Vérifier les permissions de révision
    const categoryConfig = this.translationCategories[translation.category];
    if (!this.hasPermission(reviewer, 'review_basic') && categoryConfig.requiredLevel !== 'novice') {
      throw new Error('Niveau insuffisant pour réviser cette catégorie');
    }

    const review = {
      id: this.generateReviewId(),
      reviewerId: reviewerId,
      translationId: translationId,
      timestamp: new Date().toISOString(),
      accuracy: reviewData.accuracy, // 1-5
      culturalAppropriate: reviewData.culturalAppropriate, // 1-5
      naturalness: reviewData.naturalness, // 1-5
      comments: reviewData.comments || '',
      suggestions: reviewData.suggestions || '',
      approved: reviewData.approved, // boolean
      confidence: reviewData.confidence || 0.8
    };

    translation.reviews.push(review);
    reviewer.reputation.contributions.reviews++;
    
    console.log(`👁️ Révision ajoutée pour traduction ${translationId} par ${reviewer.name}`);
    
    // Calculer si la traduction est validée
    await this.checkTranslationValidation(translationId);
    
    // Attribuer des points de réputation
    await this.awardReputationPoints(reviewerId, 'review', 5);
    
    return review;
  }

  /**
   * Validation automatique basée sur les révisions
   */
  async checkTranslationValidation(translationId) {
    const translation = this.pendingTranslations.get(translationId);
    if (!translation) return;

    const categoryConfig = this.translationCategories[translation.category];
    const requiredReviews = categoryConfig.reviewsNeeded;
    
    if (translation.reviews.length >= requiredReviews) {
      const approvalRate = translation.reviews.filter(r => r.approved).length / translation.reviews.length;
      const avgAccuracy = translation.reviews.reduce((sum, r) => sum + r.accuracy, 0) / translation.reviews.length;
      
      if (approvalRate >= 0.7 && avgAccuracy >= 3.5) {
        // Traduction validée
        translation.status = 'validated';
        this.validatedTranslations.set(translationId, translation);
        this.pendingTranslations.delete(translationId);
        
        console.log(`✅ Traduction validée: ${translation.sourceText} → ${translation.targetText}`);
        
        // Récompenser le traducteur original
        await this.awardReputationPoints(translation.contributorId, 'validated_translation', 20);
        
        return { validated: true, translation };
      } else if (approvalRate < 0.3 || avgAccuracy < 2.0) {
        // Traduction rejetée
        translation.status = 'rejected';
        console.log(`❌ Traduction rejetée: ${translation.sourceText} → ${translation.targetText}`);
        
        return { validated: false, rejected: true, translation };
      }
    }
    
    return { validated: false, needsMoreReviews: true };
  }

  /**
   * Soumission d'enregistrements audio par la communauté
   */
  async submitAudioContribution(contributorId, audioData) {
    const contributor = this.contributors.get(contributorId);
    if (!contributor) {
      throw new Error('Contributeur non trouvé');
    }

    const audioContribution = {
      id: this.generateAudioId(),
      contributorId: contributorId,
      text: audioData.text,
      language: audioData.language,
      dialect: audioData.dialect || 'standard',
      region: audioData.region,
      audioFile: audioData.audioFile,
      metadata: {
        duration: audioData.duration,
        quality: audioData.quality || 'medium',
        environment: audioData.environment || 'indoor',
        speakerAge: audioData.speakerAge,
        speakerGender: audioData.speakerGender,
        timestamp: new Date().toISOString()
      },
      status: 'pending_review',
      culturalContext: audioData.culturalContext || 'daily'
    };

    console.log(`🎤 Nouveau enregistrement audio: "${audioContribution.text}" en ${audioContribution.language}`);
    
    // Récompenser la contribution audio
    await this.awardReputationPoints(contributorId, 'audio_contribution', 15);
    await this.awardBadge(contributorId, 'audio_contributor');
    
    return audioContribution;
  }

  /**
   * Système de gamification et récompenses
   */
  async awardReputationPoints(contributorId, action, points) {
    const contributor = this.contributors.get(contributorId);
    if (!contributor) return;

    const oldPoints = contributor.reputation.points;
    contributor.reputation.points += points;
    
    // Vérifier si le niveau a changé
    const oldLevel = contributor.reputation.level;
    const newLevel = this.calculateLevel(contributor.reputation.points);
    
    if (newLevel !== oldLevel) {
      contributor.reputation.level = newLevel;
      console.log(`🆙 ${contributor.name} a atteint le niveau ${newLevel}!`);
      
      // Débloquer de nouvelles permissions
      this.updatePermissions(contributorId);
    }

    console.log(`⭐ ${contributor.name} a gagné ${points} points pour ${action} (${oldPoints} → ${contributor.reputation.points})`);
  }

  /**
   * Attribution de badges
   */
  async awardBadge(contributorId, badgeKey) {
    const contributor = this.contributors.get(contributorId);
    const badge = this.reputationSystem.badges[badgeKey];
    
    if (!contributor || !badge) return;

    if (!contributor.reputation.badges.includes(badgeKey)) {
      contributor.reputation.badges.push(badgeKey);
      await this.awardReputationPoints(contributorId, 'badge_earned', badge.points);
      
      console.log(`🏆 ${contributor.name} a obtenu le badge "${badge.name}"!`);
    }
  }

  /**
   * Création de campagnes de traduction ciblées
   */
  async createTranslationCampaign(campaignData) {
    const campaign = {
      id: this.generateCampaignId(),
      name: campaignData.name,
      description: campaignData.description,
      language: campaignData.language,
      category: campaignData.category,
      targetTexts: campaignData.targetTexts || [],
      rewards: {
        pointsPerTranslation: campaignData.pointsPerTranslation || 10,
        specialBadge: campaignData.specialBadge,
        deadline: campaignData.deadline
      },
      progress: {
        totalTexts: campaignData.targetTexts?.length || 0,
        completed: 0,
        participants: new Set()
      },
      status: 'active',
      createdAt: new Date().toISOString()
    };

    console.log(`📢 Nouvelle campagne de traduction: "${campaign.name}" pour ${campaign.language}`);
    
    return campaign;
  }

  /**
   * Recherche de traductions validées
   */
  async searchValidatedTranslations(query) {
    const results = [];
    
    for (const [id, translation] of this.validatedTranslations) {
      if (translation.sourceText.toLowerCase().includes(query.toLowerCase()) ||
          translation.targetText.toLowerCase().includes(query.toLowerCase())) {
        
        // Ajouter les métadonnées de qualité
        const qualityScore = this.calculateQualityScore(translation);
        
        results.push({
          ...translation,
          qualityScore,
          contributorName: this.contributors.get(translation.contributorId)?.name || 'Anonyme',
          reviewCount: translation.reviews.length
        });
      }
    }
    
    // Trier par score de qualité
    return results.sort((a, b) => b.qualityScore - a.qualityScore);
  }

  /**
   * Statistiques de la communauté
   */
  getCommunityStats() {
    const stats = {
      contributors: {
        total: this.contributors.size,
        active: Array.from(this.contributors.values()).filter(c => c.status === 'active').length,
        byLevel: {}
      },
      translations: {
        pending: this.pendingTranslations.size,
        validated: this.validatedTranslations.size,
        total: this.pendingTranslations.size + this.validatedTranslations.size
      },
      languages: {
        coverage: {}
      },
      activity: {
        translationsThisWeek: 0,
        reviewsThisWeek: 0,
        audioContributionsThisWeek: 0
      }
    };

    // Calculer la répartition par niveau
    for (const level of Object.keys(this.reputationSystem.levels)) {
      stats.contributors.byLevel[level] = Array.from(this.contributors.values())
        .filter(c => c.reputation.level === level).length;
    }

    // Calculer la couverture par langue
    for (const lang of Object.keys(this.languageConfig)) {
      const validatedForLang = Array.from(this.validatedTranslations.values())
        .filter(t => t.targetLanguage === lang).length;
      stats.languages.coverage[lang] = validatedForLang;
    }

    return stats;
  }

  /**
   * API pour l'interface utilisateur
   */
  async getContributorDashboard(contributorId) {
    const contributor = this.contributors.get(contributorId);
    if (!contributor) return null;

    const dashboard = {
      contributor: {
        name: contributor.name,
        level: contributor.reputation.level,
        points: contributor.reputation.points,
        badges: contributor.reputation.badges.map(b => this.reputationSystem.badges[b]),
        contributions: contributor.reputation.contributions
      },
      recent_translations: Array.from(this.pendingTranslations.values())
        .filter(t => t.contributorId === contributorId)
        .slice(0, 5),
      pending_reviews: this.reviewQueue
        .filter(t => this.canReview(contributorId, t))
        .slice(0, 10),
      achievements: {
        nextLevel: this.getNextLevel(contributor.reputation.level),
        pointsToNext: this.getPointsToNextLevel(contributor.reputation.points),
        availableBadges: this.getAvailableBadges(contributorId)
      },
      community_ranking: this.getCommunityRanking(contributorId)
    };

    return dashboard;
  }

  // Méthodes utilitaires
  generateContributorId() {
    return 'contrib_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateTranslationId() {
    return 'trans_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateReviewId() {
    return 'review_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateAudioId() {
    return 'audio_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateCampaignId() {
    return 'campaign_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  calculateLevel(points) {
    for (const [level, config] of Object.entries(this.reputationSystem.levels)) {
      if (points >= config.min && points <= config.max) {
        return level;
      }
    }
    return 'elder';
  }

  hasPermission(contributor, permission) {
    const levelConfig = this.reputationSystem.levels[contributor.reputation.level];
    return levelConfig.permissions.includes(permission) || levelConfig.permissions.includes('all');
  }

  assessDifficulty(translationData) {
    // Logic to assess translation difficulty
    let difficulty = 'basic';
    
    if (translationData.culturalContext !== 'daily') difficulty = 'intermediate';
    if (translationData.category === 'advanced') difficulty = 'advanced';
    if (translationData.category === 'specialized') difficulty = 'expert';
    
    return difficulty;
  }

  calculateQualityScore(translation) {
    if (translation.reviews.length === 0) return 0;
    
    const avgAccuracy = translation.reviews.reduce((sum, r) => sum + r.accuracy, 0) / translation.reviews.length;
    const avgCultural = translation.reviews.reduce((sum, r) => sum + r.culturalAppropriate, 0) / translation.reviews.length;
    const avgNaturalness = translation.reviews.reduce((sum, r) => sum + r.naturalness, 0) / translation.reviews.length;
    
    return (avgAccuracy + avgCultural + avgNaturalness) / 3;
  }

  addToReviewQueue(translation) {
    this.reviewQueue.push(translation);
    // Trier par priorité (catégorie, âge, etc.)
    this.reviewQueue.sort((a, b) => {
      const priorityA = this.getTranslationPriority(a);
      const priorityB = this.getTranslationPriority(b);
      return priorityB - priorityA;
    });
  }

  getTranslationPriority(translation) {
    let priority = 0;
    
    // Prioriser selon la langue
    const langConfig = this.languageConfig[translation.targetLanguage];
    if (langConfig?.priority === 'high') priority += 10;
    else if (langConfig?.priority === 'medium') priority += 5;
    
    // Prioriser selon la catégorie
    if (translation.category === 'basic') priority += 5;
    else if (translation.category === 'specialized') priority -= 2;
    
    return priority;
  }

  canReview(contributorId, translation) {
    const contributor = this.contributors.get(contributorId);
    if (!contributor) return false;
    
    // Ne peut pas réviser ses propres traductions
    if (translation.contributorId === contributorId) return false;
    
    // Vérifier les permissions
    const categoryConfig = this.translationCategories[translation.category];
    return this.hasPermission(contributor, 'review_basic');
  }

  updatePermissions(contributorId) {
    const contributor = this.contributors.get(contributorId);
    // Les permissions sont gérées automatiquement par niveau
    console.log(`🔓 Permissions mises à jour pour ${contributor.name} (niveau ${contributor.reputation.level})`);
  }

  getNextLevel(currentLevel) {
    const levels = Object.keys(this.reputationSystem.levels);
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  }

  getPointsToNextLevel(currentPoints) {
    const currentLevel = this.calculateLevel(currentPoints);
    const nextLevel = this.getNextLevel(currentLevel);
    
    if (!nextLevel) return 0;
    
    const nextLevelConfig = this.reputationSystem.levels[nextLevel];
    return nextLevelConfig.min - currentPoints;
  }

  getAvailableBadges(contributorId) {
    const contributor = this.contributors.get(contributorId);
    const availableBadges = [];
    
    for (const [badgeKey, badge] of Object.entries(this.reputationSystem.badges)) {
      if (!contributor.reputation.badges.includes(badgeKey)) {
        availableBadges.push({ key: badgeKey, ...badge });
      }
    }
    
    return availableBadges;
  }

  getCommunityRanking(contributorId) {
    const allContributors = Array.from(this.contributors.values())
      .sort((a, b) => b.reputation.points - a.reputation.points);
    
    const rank = allContributors.findIndex(c => c.id === contributorId) + 1;
    const total = allContributors.length;
    
    return { rank, total, percentile: Math.round((1 - (rank / total)) * 100) };
  }
}

export default CrowdsourcingTranslationService;
