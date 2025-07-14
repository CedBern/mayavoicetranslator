import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface PaymentMethod {
  type: string;
  name: string;
  icon: string;
  currencies: string[];
  fees: string;
  requirements?: string;
  processingTime?: string;
}

interface Subscription {
  id: string;
  planId: string;
  status: string;
  amount: number;
  currency: string;
  features: string[];
  currentPeriodEnd: string;
}

export function PaymentPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [loading, setLoading] = useState(false);
  const [paymentStats, setPaymentStats] = useState<any>(null);

  const plans = {
    basic: {
      id: 'basic',
      name: 'Basique',
      price: 9.99,
      currency: 'EUR',
      features: [
        '✅ Traduction basique',
        '✅ 2 langues indigènes',
        '✅ Support email'
      ],
      icon: '🌱',
      popular: false
    },
    pro: {
      id: 'pro',
      name: 'Professionnel',
      price: 19.99,
      currency: 'EUR',
      features: [
        '✅ Traduction avancée',
        '✅ 5 langues indigènes',
        '✅ Synthèse vocale',
        '✅ Reconnaissance vocale',
        '✅ Support prioritaire'
      ],
      icon: '🚀',
      popular: true
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      price: 39.99,
      currency: 'EUR',
      features: [
        '✅ Toutes les langues',
        '✅ Cours en direct',
        '✅ IA personnalisée',
        '✅ Support téléphonique',
        '✅ Certificats officiels',
        '✅ API personnalisée'
      ],
      icon: '👑',
      popular: false
    }
  };

  const currencies = {
    'EUR': { symbol: '€', name: 'Euro' },
    'USD': { symbol: '$', name: 'US Dollar' },
    'CAD': { symbol: 'C$', name: 'Canadian Dollar' },
    'MXN': { symbol: '$', name: 'Mexican Peso' }
  };

  useEffect(() => {
    loadPaymentMethods();
    loadSubscriptions();
    loadPaymentStats();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/payment/methods?currency=${currency}`);
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.methods || []);
      } else {
        // Données de fallback
        setPaymentMethods([
          {
            type: 'card',
            name: 'Carte bancaire',
            icon: '💳',
            currencies: ['EUR', 'USD', 'CAD', 'MXN'],
            fees: '2.9% + 0.30€'
          },
          {
            type: 'paypal',
            name: 'PayPal',
            icon: '🟦',
            currencies: ['EUR', 'USD', 'CAD', 'MXN'],
            fees: '3.4% + 0.35€'
          },
          {
            type: 'apple_pay',
            name: 'Apple Pay',
            icon: '🍎',
            currencies: ['EUR', 'USD', 'CAD', 'MXN'],
            fees: '2.9% + 0.30€',
            requirements: 'iOS/macOS avec Touch ID'
          }
        ]);
      }
    } catch (error) {
      console.error('Erreur chargement méthodes paiement:', error);
    }
  };

  const loadSubscriptions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/payment/subscriptions');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data.subscriptions || []);
      }
    } catch (error) {
      console.error('Erreur chargement abonnements:', error);
    }
  };

  const loadPaymentStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/payment/stats');
      if (response.ok) {
        const data = await response.json();
        setPaymentStats(data.stats);
      }
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    }
  };

  const createPaymentIntent = async (amount: number, description: string) => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:3000/api/payment/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          userId: 'current-user',
          description,
          paymentMethod: selectedMethod?.type || 'card'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return data.paymentIntent;
      } else {
        throw new Error(data.error || 'Erreur création intention paiement');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmPayment = async (paymentIntentId: string, securityToken: string) => {
    try {
      setLoading(true);

      const response = await fetch('http://localhost:3000/api/payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId,
          securityToken,
          paymentMethod: selectedMethod?.type || 'card'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        return data.paymentIntent;
      } else {
        throw new Error(data.error || 'Erreur confirmation paiement');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async () => {
    if (!selectedMethod) {
      Alert.alert('❌ Erreur', 'Veuillez sélectionner une méthode de paiement');
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert('❌ Erreur', 'Veuillez entrer un montant valide');
      return;
    }

    try {
      const amount = parseFloat(paymentAmount);
      const description = `Crédit Talk Kin - ${amount}${currencies[currency as keyof typeof currencies].symbol}`;

      Alert.alert(
        '💳 Confirmer le Paiement',
        `Montant: ${amount}${currencies[currency as keyof typeof currencies].symbol}\nMéthode: ${selectedMethod.name}\nFrais: ${selectedMethod.fees}`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Payer',
            onPress: async () => {
              try {
                // Créer l'intention de paiement
                const paymentIntent = await createPaymentIntent(amount, description);
                
                // Simuler la confirmation (en réalité, cela passerait par Stripe/PayPal)
                const confirmedPayment = await confirmPayment(paymentIntent.id, paymentIntent.securityToken || '');
                
                Alert.alert(
                  '✅ Paiement Réussi',
                  `Transaction: ${confirmedPayment.transactionId}\nMontant: ${amount}${currencies[currency as keyof typeof currencies].symbol}`,
                  [
                    { text: 'OK', onPress: () => {
                      setShowPaymentModal(false);
                      setPaymentAmount('');
                      loadPaymentStats();
                    }}
                  ]
                );
              } catch (error: any) {
                Alert.alert('❌ Échec du Paiement', error.message);
              }
            }
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('❌ Erreur', error.message);
    }
  };

  const subscribeToplan = async (planId: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/payment/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current-user',
          planId,
          paymentMethodId: 'pm_demo'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        Alert.alert(
          '✅ Abonnement Activé',
          `Plan ${plans[planId as keyof typeof plans].name} activé avec succès !`,
          [
            { text: 'OK', onPress: () => {
              setShowSubscriptionModal(false);
              loadSubscriptions();
            }}
          ]
        );
      } else {
        throw new Error(data.error || 'Erreur création abonnement');
      }
    } catch (error: any) {
      Alert.alert('❌ Erreur Abonnement', error.message);
    }
  };

  const cancelSubscription = async (subscriptionId: string) => {
    Alert.alert(
      '⚠️ Annuler l\'Abonnement',
      'Êtes-vous sûr de vouloir annuler cet abonnement ? Vous pourrez continuer à l\'utiliser jusqu\'à la fin de la période facturée.',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`http://localhost:3000/api/payment/subscription/${subscriptionId}/cancel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: 'User request' })
              });

              const data = await response.json();
              
              if (data.success) {
                Alert.alert('✅ Abonnement Annulé', 'Votre abonnement a été annulé avec succès');
                loadSubscriptions();
              } else {
                throw new Error(data.error || 'Erreur annulation');
              }
            } catch (error: any) {
              Alert.alert('❌ Erreur', error.message);
            }
          }
        }
      ]
    );
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity
      key={method.type}
      style={[
        styles.paymentMethodCard,
        selectedMethod?.type === method.type && styles.selectedMethod
      ]}
      onPress={() => setSelectedMethod(method)}
    >
      <Text style={styles.methodIcon}>{method.icon}</Text>
      <View style={styles.methodInfo}>
        <ThemedText style={styles.methodName}>{method.name}</ThemedText>
        <ThemedText style={styles.methodFees}>Frais: {method.fees}</ThemedText>
        {method.requirements && (
          <ThemedText style={styles.methodRequirements}>{method.requirements}</ThemedText>
        )}
      </View>
      <View style={styles.methodCheckbox}>
        {selectedMethod?.type === method.type && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderPlanCard = (plan: any) => (
    <View key={plan.id} style={[styles.planCard, plan.popular && styles.popularPlan]}>
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>POPULAIRE</Text>
        </View>
      )}
      
      <Text style={styles.planIcon}>{plan.icon}</Text>
      <ThemedText style={styles.planName}>{plan.name}</ThemedText>
      <View style={styles.planPrice}>
        <ThemedText style={styles.priceAmount}>{plan.price}€</ThemedText>
        <ThemedText style={styles.pricePeriod}>/mois</ThemedText>
      </View>

      <View style={styles.planFeatures}>
        {plan.features.map((feature: string, index: number) => (
          <ThemedText key={index} style={styles.planFeature}>{feature}</ThemedText>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.subscribeButton, plan.popular && styles.popularButton]}
        onPress={() => subscribeToplan(plan.id)}
      >
        <Text style={styles.subscribeButtonText}>S'abonner</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>💳 Paiements & Abonnements</ThemedText>
          <ThemedText style={styles.subtitle}>Gestion sécurisée de vos paiements</ThemedText>
        </View>

        {/* Statistiques */}
        {paymentStats && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <ThemedText style={styles.statNumber}>{paymentStats.totalTransactions}</ThemedText>
              <ThemedText style={styles.statLabel}>Transactions</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statNumber}>{paymentStats.totalRevenue.toFixed(2)}€</ThemedText>
              <ThemedText style={styles.statLabel}>Total Dépensé</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statNumber}>{paymentStats.activeSubscriptions}</ThemedText>
              <ThemedText style={styles.statLabel}>Abonnements</ThemedText>
            </View>
          </View>
        )}

        {/* Actions rapides */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowPaymentModal(true)}
          >
            <Text style={styles.actionIcon}>💳</Text>
            <ThemedText style={styles.actionText}>Paiement Unique</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowSubscriptionModal(true)}
          >
            <Text style={styles.actionIcon}>📅</Text>
            <ThemedText style={styles.actionText}>Abonnements</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Abonnements actuels */}
        {subscriptions.length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>📋 Mes Abonnements</ThemedText>
            {subscriptions.map(subscription => (
              <View key={subscription.id} style={styles.subscriptionCard}>
                <View style={styles.subscriptionHeader}>
                  <ThemedText style={styles.subscriptionPlan}>
                    {plans[subscription.planId as keyof typeof plans]?.name || subscription.planId}
                  </ThemedText>
                  <View style={[styles.statusBadge, 
                    subscription.status === 'active' ? styles.activeStatus : styles.canceledStatus
                  ]}>
                    <Text style={styles.statusText}>
                      {subscription.status === 'active' ? 'ACTIF' : 'ANNULÉ'}
                    </Text>
                  </View>
                </View>
                
                <ThemedText style={styles.subscriptionPrice}>
                  {subscription.amount}€ / mois
                </ThemedText>
                
                <ThemedText style={styles.subscriptionDate}>
                  Renouvelé le: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </ThemedText>

                {subscription.status === 'active' && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => cancelSubscription(subscription.id)}
                  >
                    <Text style={styles.cancelButtonText}>Annuler</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Sécurité */}
        <View style={styles.securitySection}>
          <ThemedText style={styles.sectionTitle}>🔒 Sécurité & Conformité</ThemedText>
          <View style={styles.securityFeatures}>
            <Text style={styles.securityItem}>🔐 Chiffrement SSL/TLS</Text>
            <Text style={styles.securityItem}>🏦 Certifié PCI DSS</Text>
            <Text style={styles.securityItem}>🛡️ Authentification 3D Secure</Text>
            <Text style={styles.securityItem}>🔄 Remboursement sous 14 jours</Text>
          </View>
        </View>

        {/* Modal Paiement Unique */}
        <Modal
          visible={showPaymentModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <ThemedView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>💳 Paiement Unique</ThemedText>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPaymentModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Montant */}
              <View style={styles.amountSection}>
                <ThemedText style={styles.inputLabel}>Montant</ThemedText>
                <View style={styles.amountInput}>
                  <TextInput
                    style={styles.amountTextInput}
                    value={paymentAmount}
                    onChangeText={setPaymentAmount}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.currencySymbol}>
                    {currencies[currency as keyof typeof currencies].symbol}
                  </Text>
                </View>
              </View>

              {/* Devises */}
              <View style={styles.currencySection}>
                <ThemedText style={styles.inputLabel}>Devise</ThemedText>
                <ScrollView horizontal style={styles.currencyButtons}>
                  {Object.entries(currencies).map(([code, curr]) => (
                    <TouchableOpacity
                      key={code}
                      style={[styles.currencyButton, currency === code && styles.selectedCurrency]}
                      onPress={() => setCurrency(code)}
                    >
                      <Text style={styles.currencyText}>{curr.symbol} {code}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Méthodes de paiement */}
              <View style={styles.methodsSection}>
                <ThemedText style={styles.inputLabel}>Méthode de paiement</ThemedText>
                {paymentMethods.map(renderPaymentMethod)}
              </View>

              {/* Bouton de paiement */}
              <TouchableOpacity
                style={[styles.payButton, loading && styles.disabledButton]}
                onPress={processPayment}
                disabled={loading}
              >
                <Text style={styles.payButtonText}>
                  {loading ? '⏳ Traitement...' : `💳 Payer ${paymentAmount}${currencies[currency as keyof typeof currencies].symbol}`}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </ThemedView>
        </Modal>

        {/* Modal Abonnements */}
        <Modal
          visible={showSubscriptionModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <ThemedView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>📅 Plans d'Abonnement</ThemedText>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowSubscriptionModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.plansContainer}>
                {Object.values(plans).map(renderPlanCard)}
              </View>
            </ScrollView>
          </ThemedView>
        </Modal>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subscriptionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionPlan: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeStatus: {
    backgroundColor: '#4CAF50',
  },
  canceledStatus: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  subscriptionPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 4,
  },
  subscriptionDate: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  securitySection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  securityFeatures: {
    marginTop: 8,
  },
  securityItem: {
    fontSize: 14,
    marginBottom: 8,
    paddingLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  amountSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
  },
  amountTextInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666',
  },
  currencySection: {
    marginBottom: 20,
  },
  currencyButtons: {
    flexDirection: 'row',
  },
  currencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCurrency: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  currencyText: {
    fontWeight: '500',
  },
  methodsSection: {
    marginBottom: 20,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedMethod: {
    borderColor: '#2196F3',
    backgroundColor: '#f0f8ff',
  },
  methodIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  methodFees: {
    fontSize: 12,
    opacity: 0.7,
  },
  methodRequirements: {
    fontSize: 10,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  methodCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  plansContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  planCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  popularPlan: {
    borderColor: '#FF9800',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  popularText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  planPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  priceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  pricePeriod: {
    fontSize: 14,
    color: '#666',
  },
  planFeatures: {
    marginBottom: 16,
  },
  planFeature: {
    fontSize: 12,
    marginBottom: 4,
    lineHeight: 16,
  },
  subscribeButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  popularButton: {
    backgroundColor: '#FF9800',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
