/**
 * 💰 SERVICE DE GESTION DES CRÉDITS
 * Système de monétisation pour tests de niveau et fonctionnalités premium
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

interface CreditAccount {
    userId: string;
    balance: number;
    totalPurchased: number;
    totalSpent: number;
    currency: string;
    subscriptionType?: 'free' | 'basic' | 'premium' | 'institution';
    subscriptionExpiry?: number;
    lastTransaction: number;
}

interface CreditTransaction {
    id: string;
    userId: string;
    type: 'purchase' | 'spent' | 'refund' | 'bonus';
    amount: number;
    description: string;
    timestamp: number;
    reference?: string;
    metadata?: any;
}

interface CreditPackage {
    id: string;
    name: string;
    credits: number;
    price: number;
    currency: string;
    bonus: number;
    popular?: boolean;
    description: string;
}

interface SubscriptionPlan {
    id: string;
    name: string;
    monthlyCredits: number;
    price: number;
    currency: string;
    features: string[];
    duration: 'monthly' | 'yearly';
    discount?: number;
}

export class CreditManagementService {
    private static instance: CreditManagementService;
    private creditAccount: CreditAccount | null = null;
    private transactions: CreditTransaction[] = [];

    // Packages de crédits disponibles
    private creditPackages: CreditPackage[] = [
        {
            id: 'starter',
            name: 'Pack Découverte',
            credits: 10,
            price: 4.99,
            currency: 'EUR',
            bonus: 0,
            description: 'Pour essayer nos tests de niveau'
        },
        {
            id: 'student',
            name: 'Pack Étudiant',
            credits: 25,
            price: 9.99,
            currency: 'EUR',
            bonus: 5,
            popular: true,
            description: 'Idéal pour les étudiants réguliers'
        },
        {
            id: 'teacher',
            name: 'Pack Professeur',
            credits: 50,
            price: 19.99,
            currency: 'EUR',
            bonus: 15,
            description: 'Pour les enseignants et tuteurs'
        },
        {
            id: 'school',
            name: 'Pack Établissement',
            credits: 100,
            price: 34.99,
            currency: 'EUR',
            bonus: 30,
            description: 'Pour écoles et instituts'
        },
        {
            id: 'premium',
            name: 'Pack Premium',
            credits: 200,
            price: 59.99,
            currency: 'EUR',
            bonus: 70,
            description: 'Maximum de crédits avec bonus énorme'
        }
    ];

    // Plans d'abonnement
    private subscriptionPlans: SubscriptionPlan[] = [
        {
            id: 'basic_monthly',
            name: 'Basic Mensuel',
            monthlyCredits: 20,
            price: 7.99,
            currency: 'EUR',
            duration: 'monthly',
            features: [
                '20 crédits par mois',
                'Tests de niveau standard',
                'Support email'
            ]
        },
        {
            id: 'premium_monthly',
            name: 'Premium Mensuel',
            monthlyCredits: 50,
            price: 16.99,
            currency: 'EUR',
            duration: 'monthly',
            features: [
                '50 crédits par mois',
                'Tests adaptatifs avancés',
                'Analyses détaillées',
                'Support prioritaire'
            ]
        },
        {
            id: 'premium_yearly',
            name: 'Premium Annuel',
            monthlyCredits: 50,
            price: 149.99,
            currency: 'EUR',
            duration: 'yearly',
            discount: 25,
            features: [
                '50 crédits par mois',
                'Tests adaptatifs avancés',
                'Analyses détaillées',
                'Support prioritaire',
                '25% d\'économie'
            ]
        }
    ];

    // Coûts des différents services
    private serviceCosts = {
        level_test_basic: 3,
        level_test_adaptive: 5,
        level_test_comprehensive: 8,
        conversation_sync: 2,
        premium_translation: 1,
        ai_feedback: 2,
        progress_report: 1,
        certificate: 10
    };

    public static getInstance(): CreditManagementService {
        if (!CreditManagementService.instance) {
            CreditManagementService.instance = new CreditManagementService();
        }
        return CreditManagementService.instance;
    }

    /**
     * 🏁 INITIALISATION COMPTE UTILISATEUR
     */
    async initializeAccount(userId: string): Promise<CreditAccount> {
        try {
            // Charger compte existant
            const existingAccount = await this.loadAccount(userId);
            if (existingAccount) {
                this.creditAccount = existingAccount;
                return existingAccount;
            }

            // Créer nouveau compte avec crédits de bienvenue
            const newAccount: CreditAccount = {
                userId,
                balance: 5, // 5 crédits de bienvenue
                totalPurchased: 0,
                totalSpent: 0,
                currency: 'EUR',
                subscriptionType: 'free',
                lastTransaction: Date.now()
            };

            await this.saveAccount(newAccount);
            this.creditAccount = newAccount;

            // Ajouter transaction de bienvenue
            await this.addTransaction({
                type: 'bonus',
                amount: 5,
                description: 'Crédits de bienvenue',
                reference: 'welcome_bonus'
            });

            console.log('🎁 Compte créé avec 5 crédits de bienvenue');
            return newAccount;

        } catch (error) {
            console.error('❌ Erreur initialisation compte:', error);
            throw error;
        }
    }

    /**
     * 💰 VÉRIFICATION CRÉDITS DISPONIBLES
     */
    async checkCredits(requiredCredits: number): Promise<boolean> {
        if (!this.creditAccount) {
            throw new Error('Compte non initialisé');
        }

        return this.creditAccount.balance >= requiredCredits;
    }

    /**
     * 💸 DÉBIT CRÉDITS
     */
    async spendCredits(
        amount: number, 
        service: string, 
        description: string,
        metadata?: any
    ): Promise<boolean> {
        if (!this.creditAccount) {
            throw new Error('Compte non initialisé');
        }

        if (this.creditAccount.balance < amount) {
            throw new Error('Crédits insuffisants');
        }

        // Débiter le compte
        this.creditAccount.balance -= amount;
        this.creditAccount.totalSpent += amount;
        this.creditAccount.lastTransaction = Date.now();

        // Enregistrer transaction
        await this.addTransaction({
            type: 'spent',
            amount: -amount,
            description,
            reference: service,
            metadata
        });

        // Sauvegarder compte
        await this.saveAccount(this.creditAccount);

        console.log(`💸 ${amount} crédits dépensés pour: ${description}`);
        return true;
    }

    /**
     * 🛒 ACHAT PACKAGE DE CRÉDITS
     */
    async purchaseCredits(packageId: string, paymentMethod: string): Promise<boolean> {
        const package_ = this.creditPackages.find(p => p.id === packageId);
        if (!package_) {
            throw new Error('Package introuvable');
        }

        if (!this.creditAccount) {
            throw new Error('Compte non initialisé');
        }

        try {
            // Simuler traitement paiement
            const paymentResult = await this.processPayment(
                package_.price,
                package_.currency,
                paymentMethod
            );

            if (!paymentResult.success) {
                throw new Error('Paiement échoué');
            }

            // Ajouter crédits + bonus
            const totalCredits = package_.credits + package_.bonus;
            this.creditAccount.balance += totalCredits;
            this.creditAccount.totalPurchased += package_.price;
            this.creditAccount.lastTransaction = Date.now();

            // Enregistrer transaction
            await this.addTransaction({
                type: 'purchase',
                amount: totalCredits,
                description: `Achat ${package_.name}`,
                reference: paymentResult.transactionId,
                metadata: {
                    packageId,
                    price: package_.price,
                    currency: package_.currency,
                    bonus: package_.bonus
                }
            });

            // Sauvegarder compte
            await this.saveAccount(this.creditAccount);

            console.log(`🎉 ${totalCredits} crédits ajoutés (${package_.credits} + ${package_.bonus} bonus)`);
            return true;

        } catch (error) {
            console.error('❌ Erreur achat crédits:', error);
            throw error;
        }
    }

    /**
     * 📊 PRÉVENTION ABUS PROFESSEURS
     */
    async validateTeacherTestAccess(
        teacherId: string,
        studentId: string,
        testType: string
    ): Promise<{ allowed: boolean; reason?: string; alternatives?: string[] }> {
        try {
            // Vérifier historique récent
            const recentTests = await this.getRecentTestHistory(teacherId, 7); // 7 derniers jours
            const testsForStudent = recentTests.filter(t => t.metadata?.studentId === studentId);

            // Limite: 1 test complet par étudiant par semaine
            if (testsForStudent.length >= 1 && testType === 'comprehensive') {
                return {
                    allowed: false,
                    reason: 'Limite atteinte: 1 test complet par étudiant par semaine',
                    alternatives: [
                        'Test rapide (3 crédits)',
                        'Auto-évaluation étudiant (gratuit)',
                        'Attendre 7 jours'
                    ]
                };
            }

            // Limite globale: 10 tests par jour maximum
            if (recentTests.filter(t => this.isToday(t.timestamp)).length >= 10) {
                return {
                    allowed: false,
                    reason: 'Limite quotidienne atteinte (10 tests par jour)',
                    alternatives: [
                        'Reprendre demain',
                        'Passer à un abonnement premium'
                    ]
                };
            }

            // Vérifier pattern d'utilisation suspect
            const suspiciousPattern = this.detectSuspiciousPattern(recentTests);
            if (suspiciousPattern.detected) {
                return {
                    allowed: false,
                    reason: suspiciousPattern.reason,
                    alternatives: [
                        'Contacter le support',
                        'Valider votre statut d\'enseignant'
                    ]
                };
            }

            return { allowed: true };

        } catch (error) {
            console.error('❌ Erreur validation accès:', error);
            return {
                allowed: false,
                reason: 'Erreur système',
                alternatives: ['Réessayer plus tard']
            };
        }
    }

    /**
     * 🎓 AUTO-ÉVALUATION GRATUITE ÉTUDIANT
     */
    async initiateFreeStudentAssessment(studentId: string): Promise<{
        sessionId: string;
        estimatedLevel: string;
        confidence: number;
        nextSteps: string[];
    }> {
        // Auto-évaluation gratuite basée sur questionnaire simplifié
        const sessionId = `free_assessment_${Date.now()}`;
        
        // Enregistrer utilisation gratuite
        await this.addTransaction({
            type: 'bonus',
            amount: 0,
            description: 'Auto-évaluation gratuite',
            reference: 'free_assessment',
            metadata: { studentId, sessionId }
        });

        return {
            sessionId,
            estimatedLevel: 'B1', // Niveau par défaut
            confidence: 0.7,
            nextSteps: [
                'Passer un test complet pour précision (+95%)',
                'Commencer apprentissage adapté',
                'Renouveler dans 30 jours'
            ]
        };
    }

    /**
     * 📈 ANALYTICS UTILISATION
     */
    async getUsageAnalytics(userId: string, days: number = 30): Promise<any> {
        const transactions = await this.getTransactionHistory(userId, days);
        
        const analytics = {
            totalSpent: transactions
                .filter(t => t.type === 'spent')
                .reduce((sum, t) => sum + Math.abs(t.amount), 0),
            
            totalPurchased: transactions
                .filter(t => t.type === 'purchase')
                .reduce((sum, t) => sum + t.amount, 0),
            
            averageSpendingPerDay: 0,
            mostUsedService: '',
            recommendations: [] as string[]
        };

        // Calculer moyenne journalière
        analytics.averageSpendingPerDay = analytics.totalSpent / days;

        // Service le plus utilisé
        const serviceUsage = transactions
            .filter(t => t.type === 'spent')
            .reduce((acc, t) => {
                const service = t.reference || 'unknown';
                acc[service] = (acc[service] || 0) + Math.abs(t.amount);
                return acc;
            }, {} as Record<string, number>);

        analytics.mostUsedService = Object.entries(serviceUsage)
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

        // Recommandations
        if (analytics.averageSpendingPerDay > 2) {
            analytics.recommendations.push('Considérer un abonnement Premium pour économiser');
        }
        if (analytics.totalSpent > 50) {
            analytics.recommendations.push('Vous pourriez bénéficier du statut VIP');
        }

        return analytics;
    }

    /**
     * 🔧 MÉTHODES PRIVÉES
     */
    private async loadAccount(userId: string): Promise<CreditAccount | null> {
        try {
            const data = await AsyncStorage.getItem(`credit_account_${userId}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Erreur chargement compte:', error);
            return null;
        }
    }

    private async saveAccount(account: CreditAccount): Promise<void> {
        try {
            await AsyncStorage.setItem(
                `credit_account_${account.userId}`,
                JSON.stringify(account)
            );
        } catch (error) {
            console.error('❌ Erreur sauvegarde compte:', error);
            throw error;
        }
    }

    private async addTransaction(transaction: Omit<CreditTransaction, 'id' | 'userId' | 'timestamp'>): Promise<void> {
        if (!this.creditAccount) return;

        const fullTransaction: CreditTransaction = {
            id: `tx_${Date.now()}_${Math.random().toString(36).substring(2)}`,
            userId: this.creditAccount.userId,
            timestamp: Date.now(),
            ...transaction
        };

        this.transactions.push(fullTransaction);

        // Sauvegarder historique (garder 100 dernières transactions)
        const recentTransactions = this.transactions.slice(-100);
        try {
            await AsyncStorage.setItem(
                `transactions_${this.creditAccount.userId}`,
                JSON.stringify(recentTransactions)
            );
        } catch (error) {
            console.error('❌ Erreur sauvegarde transaction:', error);
        }
    }

    private async processPayment(amount: number, currency: string, method: string): Promise<any> {
        // Simulation traitement paiement
        // Dans une vraie app, intégrer Stripe, PayPal, etc.
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    transactionId: `pay_${Date.now()}`,
                    method,
                    amount,
                    currency
                });
            }, 2000);
        });
    }

    private async getRecentTestHistory(userId: string, days: number): Promise<CreditTransaction[]> {
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        return this.transactions
            .filter(t => 
                t.userId === userId && 
                t.timestamp > cutoff && 
                t.reference?.includes('test')
            );
    }

    private async getTransactionHistory(userId: string, days: number): Promise<CreditTransaction[]> {
        const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
        return this.transactions
            .filter(t => t.userId === userId && t.timestamp > cutoff);
    }

    private isToday(timestamp: number): boolean {
        const today = new Date();
        const date = new Date(timestamp);
        return date.toDateString() === today.toDateString();
    }

    private detectSuspiciousPattern(transactions: CreditTransaction[]): { detected: boolean; reason?: string } {
        // Détecter patterns suspects
        const hourlyFrequency = transactions.length / 24; // Tests par heure
        const uniqueStudents = new Set(
            transactions.map(t => t.metadata?.studentId).filter(Boolean)
        ).size;

        // Trop de tests pour trop peu d'étudiants
        if (transactions.length > 20 && uniqueStudents < 5) {
            return {
                detected: true,
                reason: 'Pattern suspect: trop de tests pour peu d\'étudiants'
            };
        }

        // Fréquence anormalement élevée
        if (hourlyFrequency > 3) {
            return {
                detected: true,
                reason: 'Fréquence de tests anormalement élevée'
            };
        }

        return { detected: false };
    }

    /**
     * 📋 GETTERS PUBLICS
     */
    getCurrentBalance(): number {
        return this.creditAccount?.balance || 0;
    }

    getCreditPackages(): CreditPackage[] {
        return this.creditPackages;
    }

    getSubscriptionPlans(): SubscriptionPlan[] {
        return this.subscriptionPlans;
    }

    getServiceCost(service: string): number {
        return this.serviceCosts[service as keyof typeof this.serviceCosts] || 0;
    }

    getCurrentAccount(): CreditAccount | null {
        return this.creditAccount;
    }
}

export default CreditManagementService;
