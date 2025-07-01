/**
 * 💳 Service de Paiement Sécurisé
 * Gestion des paiements pour Talk Kin avec sécurité renforcée
 */

class SecurePaymentService {
  constructor() {
    this.paymentMethods = new Map();
    this.transactions = new Map();
    this.subscriptions = new Map();
    this.securityTokens = new Map();
    
    this.initializePaymentGateways();
    this.initializeCurrencies();
  }

  initializePaymentGateways() {
    // Configuration des passerelles de paiement
    this.gateways = {
      stripe: {
        apiKey: process.env.STRIPE_SECRET_KEY || 'sk_test_demo',
        publicKey: process.env.STRIPE_PUBLIC_KEY || 'pk_test_demo',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_demo',
        enabled: true,
        currencies: ['EUR', 'USD', 'CAD', 'MXN', 'PEN', 'BOL', 'PYG'],
        methods: ['card', 'sepa', 'ideal', 'bancontact']
      },
      paypal: {
        clientId: process.env.PAYPAL_CLIENT_ID || 'demo_client_id',
        clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'demo_secret',
        environment: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
        enabled: true,
        currencies: ['EUR', 'USD', 'CAD', 'MXN'],
        methods: ['paypal', 'venmo']
      },
      apple: {
        merchantId: process.env.APPLE_MERCHANT_ID || 'merchant.talkkin.demo',
        enabled: true,
        currencies: ['EUR', 'USD', 'CAD', 'MXN'],
        methods: ['apple_pay']
      },
      google: {
        merchantId: process.env.GOOGLE_MERCHANT_ID || 'demo_merchant',
        enabled: true,
        currencies: ['EUR', 'USD', 'CAD', 'MXN'],
        methods: ['google_pay']
      }
    };
  }

  initializeCurrencies() {
    // Devises supportées avec taux de change
    this.currencies = {
      'EUR': { symbol: '€', rate: 1.0, name: 'Euro' },
      'USD': { symbol: '$', rate: 1.08, name: 'US Dollar' },
      'CAD': { symbol: 'C$', rate: 1.46, name: 'Canadian Dollar' },
      'MXN': { symbol: '$', rate: 18.50, name: 'Mexican Peso' },
      'PEN': { symbol: 'S/', rate: 3.76, name: 'Peruvian Sol' },
      'BOL': { symbol: 'Bs', rate: 6.91, name: 'Bolivian Boliviano' },
      'PYG': { symbol: '₲', rate: 7234, name: 'Paraguayan Guaraní' }
    };
  }

  // Génération de token de sécurité
  generateSecurityToken(userId, amount, currency) {
    const tokenData = {
      userId,
      amount,
      currency,
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substring(2, 15),
      expiry: Date.now() + (15 * 60 * 1000) // 15 minutes
    };

    const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');
    this.securityTokens.set(token, tokenData);
    
    // Auto-cleanup après expiry
    setTimeout(() => {
      this.securityTokens.delete(token);
    }, 15 * 60 * 1000);

    return token;
  }

  // Validation du token de sécurité
  validateSecurityToken(token) {
    const tokenData = this.securityTokens.get(token);
    
    if (!tokenData) {
      throw new Error('Token invalide ou expiré');
    }

    if (Date.now() > tokenData.expiry) {
      this.securityTokens.delete(token);
      throw new Error('Token expiré');
    }

    return tokenData;
  }

  // Conversion de devises
  convertCurrency(amount, fromCurrency, toCurrency) {
    const fromRate = this.currencies[fromCurrency]?.rate || 1;
    const toRate = this.currencies[toCurrency]?.rate || 1;
    
    const eurAmount = amount / fromRate;
    const convertedAmount = eurAmount * toRate;
    
    return {
      originalAmount: amount,
      originalCurrency: fromCurrency,
      convertedAmount: Math.round(convertedAmount * 100) / 100,
      convertedCurrency: toCurrency,
      exchangeRate: toRate / fromRate,
      timestamp: new Date().toISOString()
    };
  }

  // Création d'une intention de paiement
  async createPaymentIntent(paymentData) {
    try {
      const {
        amount,
        currency,
        userId,
        description,
        metadata = {},
        paymentMethod = 'card'
      } = paymentData;

      // Validation des données
      this.validatePaymentData(paymentData);

      // Génération d'un token de sécurité
      const securityToken = this.generateSecurityToken(userId, amount, currency);

      // Création de l'intention de paiement
      const paymentIntent = {
        id: `pi_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        amount: Math.round(amount * 100), // En centimes
        currency: currency.toLowerCase(),
        userId,
        description,
        metadata,
        paymentMethod,
        status: 'requires_payment_method',
        securityToken,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36)}`
      };

      // Simulation d'appel à Stripe ou autre gateway
      if (this.gateways.stripe.enabled && paymentMethod === 'card') {
        paymentIntent.stripeIntentId = `pi_stripe_${Date.now()}`;
        paymentIntent.gateway = 'stripe';
      } else if (this.gateways.paypal.enabled && paymentMethod === 'paypal') {
        paymentIntent.paypalOrderId = `ORDER_${Date.now()}`;
        paymentIntent.gateway = 'paypal';
      }

      this.transactions.set(paymentIntent.id, paymentIntent);

      return {
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          clientSecret: paymentIntent.clientSecret,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status
        },
        securityToken
      };

    } catch (error) {
      throw new Error(`Erreur création intention paiement: ${error.message}`);
    }
  }

  // Confirmation d'un paiement
  async confirmPayment(paymentIntentId, confirmationData) {
    try {
      const paymentIntent = this.transactions.get(paymentIntentId);
      
      if (!paymentIntent) {
        throw new Error('Intention de paiement non trouvée');
      }

      if (paymentIntent.status !== 'requires_payment_method') {
        throw new Error('Intention de paiement dans un état invalide');
      }

      // Validation du token de sécurité
      this.validateSecurityToken(confirmationData.securityToken);

      // Simulation du traitement de paiement
      const success = Math.random() > 0.1; // 90% de succès simulé

      if (success) {
        paymentIntent.status = 'succeeded';
        paymentIntent.confirmedAt = new Date().toISOString();
        paymentIntent.transactionId = `txn_${Date.now()}`;
        
        // Simulation des frais
        const fees = Math.round(paymentIntent.amount * 0.029 + 30); // 2.9% + 0.30€
        paymentIntent.fees = fees;
        paymentIntent.netAmount = paymentIntent.amount - fees;

        // Création du reçu
        const receipt = await this.generateReceipt(paymentIntent);
        paymentIntent.receiptUrl = receipt.url;

        return {
          success: true,
          paymentIntent: {
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            transactionId: paymentIntent.transactionId,
            receiptUrl: paymentIntent.receiptUrl
          }
        };
      } else {
        paymentIntent.status = 'requires_payment_method';
        paymentIntent.lastError = {
          type: 'card_error',
          code: 'card_declined',
          message: 'Votre carte a été refusée.'
        };

        throw new Error('Paiement refusé par la banque');
      }

    } catch (error) {
      throw new Error(`Erreur confirmation paiement: ${error.message}`);
    }
  }

  // Gestion des abonnements
  async createSubscription(subscriptionData) {
    try {
      const {
        userId,
        planId,
        paymentMethodId,
        billingCycle = 'monthly',
        startDate = new Date()
      } = subscriptionData;

      const plans = {
        'basic': { price: 9.99, features: ['Basic translation', '2 languages'] },
        'pro': { price: 19.99, features: ['Advanced translation', '5 languages', 'Voice synthesis'] },
        'premium': { price: 39.99, features: ['All languages', 'Live classes', 'Premium support'] }
      };

      const plan = plans[planId];
      if (!plan) {
        throw new Error('Plan d\'abonnement invalide');
      }

      const subscription = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        userId,
        planId,
        status: 'active',
        currentPeriodStart: startDate.toISOString(),
        currentPeriodEnd: new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString(),
        billingCycle,
        amount: plan.price,
        currency: 'EUR',
        paymentMethodId,
        createdAt: new Date().toISOString(),
        features: plan.features
      };

      this.subscriptions.set(subscription.id, subscription);

      return {
        success: true,
        subscription
      };

    } catch (error) {
      throw new Error(`Erreur création abonnement: ${error.message}`);
    }
  }

  // Annulation d'abonnement
  async cancelSubscription(subscriptionId, reason = '') {
    try {
      const subscription = this.subscriptions.get(subscriptionId);
      
      if (!subscription) {
        throw new Error('Abonnement non trouvé');
      }

      subscription.status = 'canceled';
      subscription.canceledAt = new Date().toISOString();
      subscription.cancellationReason = reason;

      return {
        success: true,
        subscription: {
          id: subscription.id,
          status: subscription.status,
          canceledAt: subscription.canceledAt,
          validUntil: subscription.currentPeriodEnd
        }
      };

    } catch (error) {
      throw new Error(`Erreur annulation abonnement: ${error.message}`);
    }
  }

  // Remboursement
  async createRefund(transactionId, amount = null, reason = '') {
    try {
      const transaction = Array.from(this.transactions.values())
        .find(t => t.transactionId === transactionId);

      if (!transaction) {
        throw new Error('Transaction non trouvée');
      }

      if (transaction.status !== 'succeeded') {
        throw new Error('Transaction non éligible au remboursement');
      }

      const refundAmount = amount || transaction.amount;
      
      if (refundAmount > transaction.amount) {
        throw new Error('Montant de remboursement supérieur au montant original');
      }

      const refund = {
        id: `re_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        transactionId,
        amount: refundAmount,
        currency: transaction.currency,
        reason,
        status: 'succeeded',
        createdAt: new Date().toISOString()
      };

      // Mise à jour de la transaction
      transaction.refunded = true;
      transaction.refundAmount = refundAmount;
      transaction.refundId = refund.id;

      return {
        success: true,
        refund
      };

    } catch (error) {
      throw new Error(`Erreur création remboursement: ${error.message}`);
    }
  }

  // Génération de reçu
  async generateReceipt(paymentIntent) {
    const receiptData = {
      id: `receipt_${paymentIntent.id}`,
      transactionId: paymentIntent.transactionId,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency.toUpperCase(),
      description: paymentIntent.description,
      date: paymentIntent.confirmedAt,
      merchantName: 'Talk Kin',
      merchantAddress: 'Platform for Indigenous Languages',
      customerEmail: 'user@talkkin.com', // À récupérer depuis les données utilisateur
      url: `https://talkkin.com/receipts/${paymentIntent.id}`
    };

    return {
      url: receiptData.url,
      data: receiptData
    };
  }

  // Validation des données de paiement
  validatePaymentData(paymentData) {
    const { amount, currency, userId } = paymentData;

    if (!amount || amount <= 0) {
      throw new Error('Montant invalide');
    }

    if (!currency || !this.currencies[currency]) {
      throw new Error('Devise non supportée');
    }

    if (!userId) {
      throw new Error('Utilisateur requis');
    }

    if (amount > 10000) { // Limite de 10000€
      throw new Error('Montant trop élevé (limite: 10000€)');
    }
  }

  // Statistiques de paiement
  async getPaymentStats(userId = null) {
    const transactions = Array.from(this.transactions.values());
    const subscriptions = Array.from(this.subscriptions.values());

    const userTransactions = userId 
      ? transactions.filter(t => t.userId === userId)
      : transactions;

    const userSubscriptions = userId
      ? subscriptions.filter(s => s.userId === userId)
      : subscriptions;

    const totalRevenue = userTransactions
      .filter(t => t.status === 'succeeded')
      .reduce((sum, t) => sum + (t.amount / 100), 0);

    const totalFees = userTransactions
      .filter(t => t.status === 'succeeded')
      .reduce((sum, t) => sum + ((t.fees || 0) / 100), 0);

    return {
      totalTransactions: userTransactions.length,
      successfulTransactions: userTransactions.filter(t => t.status === 'succeeded').length,
      totalRevenue,
      totalFees,
      netRevenue: totalRevenue - totalFees,
      activeSubscriptions: userSubscriptions.filter(s => s.status === 'active').length,
      canceledSubscriptions: userSubscriptions.filter(s => s.status === 'canceled').length,
      averageTransactionValue: userTransactions.length > 0 
        ? totalRevenue / userTransactions.filter(t => t.status === 'succeeded').length 
        : 0
    };
  }

  // Méthodes de paiement disponibles pour un utilisateur
  getAvailablePaymentMethods(currency = 'EUR', country = 'FR') {
    const methods = [];

    // Carte de crédit (toujours disponible)
    methods.push({
      type: 'card',
      name: 'Carte bancaire',
      icon: '💳',
      currencies: Object.keys(this.currencies),
      fees: '2.9% + 0.30€'
    });

    // PayPal
    if (this.gateways.paypal.enabled) {
      methods.push({
        type: 'paypal',
        name: 'PayPal',
        icon: '🟦',
        currencies: this.gateways.paypal.currencies,
        fees: '3.4% + 0.35€'
      });
    }

    // Apple Pay (si iOS)
    methods.push({
      type: 'apple_pay',
      name: 'Apple Pay',
      icon: '🍎',
      currencies: this.gateways.apple.currencies,
      fees: '2.9% + 0.30€',
      requirements: 'iOS/macOS avec Touch ID ou Face ID'
    });

    // Google Pay (si Android)
    methods.push({
      type: 'google_pay',
      name: 'Google Pay',
      icon: '🅶',
      currencies: this.gateways.google.currencies,
      fees: '2.9% + 0.30€',
      requirements: 'Android avec NFC'
    });

    // SEPA (pour l'Europe)
    if (['EUR'].includes(currency) && ['FR', 'DE', 'ES', 'IT', 'NL', 'BE'].includes(country)) {
      methods.push({
        type: 'sepa',
        name: 'Virement SEPA',
        icon: '🏦',
        currencies: ['EUR'],
        fees: '0.80€',
        processingTime: '1-3 jours ouvrés'
      });
    }

    return methods.filter(method => method.currencies.includes(currency));
  }
}

export default SecurePaymentService;
