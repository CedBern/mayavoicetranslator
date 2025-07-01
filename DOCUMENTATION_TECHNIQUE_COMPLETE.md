# 🔧 DOCUMENTATION TECHNIQUE - Module Réservation & Gamification

## 📋 Vue d'ensemble Technique

Ce document détaille l'implémentation technique du module de réservation de cours particuliers et du hub d'apprentissage gamifié pour Talk Kin.

### 🏗️ Architecture Générale

```
Talk Kin Platform
├── Frontend (React Native + TypeScript)
│   ├── components/
│   │   ├── TutoringReservationSystem.tsx    # Interface réservation
│   │   ├── AdminPanel.tsx                   # Interface admin
│   │   ├── GamefiedLearningHub.tsx         # Hub gamifié
│   │   └── LyricsTraining.tsx              # Activité musicale
│   └── services/
│       ├── TutoringReservationService.js    # API réservations
│       └── CreditManagementService.ts       # Gestion crédits
├── Backend APIs
│   ├── Zoom Integration
│   ├── Google Meet Integration
│   ├── Microsoft Teams Integration
│   ├── Stripe Payment Gateway
│   └── Email/SMS Notifications
└── Database
    ├── Users & Profiles
    ├── Reservations & Bookings
    ├── Gamification Data
    └── Payment Transactions
```

---

## 🎓 Module de Réservation de Cours

### 🔧 Composant Principal: `TutoringReservationSystem.tsx`

#### Interfaces TypeScript

```typescript
interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  price: number;
  subject?: string;
}

interface Reservation {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  professorId: string;
  timeSlot: TimeSlot;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  meetingLink?: string;
  meetingType: 'zoom' | 'meet' | 'teams' | 'phone' | 'in-person';
  notes?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

interface Professor {
  id: string;
  name: string;
  subjects: string[];
  hourlyRate: number;
  rating: number;
  totalSessions: number;
  availability: TimeSlot[];
  bio: string;
  languages: string[];
  certifications: string[];
}
```

#### Fonctionnalités Clés

##### 1. Recherche et Filtrage de Professeurs
```typescript
const loadProfessors = async () => {
  // Chargement des professeurs avec filtres
  // - Par matière
  // - Par prix 
  // - Par évaluation
  // - Par disponibilité
};
```

##### 2. Système de Réservation
```typescript
const bookSession = async () => {
  // 1. Validation du créneau
  // 2. Traitement du paiement
  // 3. Création de la réservation
  // 4. Génération du lien de réunion
  // 5. Envoi des notifications
};
```

##### 3. Gestion des États
```typescript
const [professors, setProfessors] = useState<Professor[]>([]);
const [reservations, setReservations] = useState<Reservation[]>([]);
const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
```

### 🌐 Service Backend: `TutoringReservationService.js`

#### Méthodes Principales

##### Gestion des Réservations
```javascript
class TutoringReservationService {
  async createReservation(reservationData) {
    // 1. Validation des données
    // 2. Vérification disponibilité
    // 3. Traitement paiement
    // 4. Création réservation
    // 5. Notifications
    return { success: true, reservation, message };
  }

  async confirmReservation(reservationId, professorId, meetingLink) {
    // 1. Validation autorisation
    // 2. Génération lien réunion
    // 3. Mise à jour statut
    // 4. Notifications confirmation
    return { success: true, reservation };
  }

  async cancelReservation(reservationId, userId, reason, userType) {
    // 1. Vérification politique annulation
    // 2. Traitement remboursement
    // 3. Libération créneau
    // 4. Notifications annulation
    return { success: true, reservation };
  }
}
```

##### Intégrations Vidéo
```javascript
async generateMeetingLink(reservation) {
  const { meetingType } = reservation;
  
  switch (meetingType) {
    case 'zoom':
      return await this.createZoomMeeting(reservation);
    case 'meet':
      return await this.createGoogleMeetLink(reservation);
    case 'teams':
      return await this.createTeamsMeeting(reservation);
    default:
      return `https://meet.talkkin.com/room/${reservation.id}`;
  }
}
```

##### Système de Paiement
```javascript
async processPayment(reservation) {
  // Intégration Stripe
  const amount = reservation.timeSlot.price * 100;
  const platformFee = Math.floor(amount * 0.1); // 10% commission
  
  // Traitement paiement
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'eur',
    payment_method: reservation.paymentMethodId,
    confirm: true
  });
  
  return {
    success: paymentIntent.status === 'succeeded',
    paymentId: paymentIntent.id,
    platformFee
  };
}
```

---

## 🎮 Module d'Apprentissage Gamifié

### 🔧 Composant Principal: `GamefiedLearningHub.tsx`

#### Interfaces de Gamification

```typescript
interface Activity {
  id: string;
  type: 'lyrics' | 'pronunciation' | 'conversation' | 'grammar' | 'culture';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  xpReward: number;
  isLocked: boolean;
  completedAt?: string;
  progress?: number;
}

interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  totalActivitiesCompleted: number;
  weeklyGoal: number;
  weeklyProgress: number;
}
```

#### Système de Progression

##### Calcul des Niveaux
```typescript
const calculateLevel = (xp: number) => {
  return Math.floor(xp / 100) + 1;
};

const getXpToNextLevel = (currentXp: number) => {
  const currentLevel = calculateLevel(currentXp);
  const xpForNextLevel = currentLevel * 100;
  return xpForNextLevel - currentXp;
};
```

##### Système d'Achievements
```typescript
const checkAchievements = async (xp: number, level: number, activitiesCompleted: number) => {
  const newAchievements = [];
  
  // Achievement premier chant
  if (activitiesCompleted >= 1 && !achievements.find(a => a.id === 'first-song')?.isUnlocked) {
    newAchievements.push('first-song');
  }
  
  // Achievement niveau 5
  if (level >= 5 && !achievements.find(a => a.id === 'level-5')?.isUnlocked) {
    newAchievements.push('level-5');
  }
  
  // Notification nouveaux achievements
  if (newAchievements.length > 0) {
    setAchievements(prev => prev.map(a => 
      newAchievements.includes(a.id) 
        ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() }
        : a
    ));
  }
};
```

### 🎵 Composant Activité: `LyricsTraining.tsx`

#### Structure de Données Musicales

```typescript
interface Song {
  id: string;
  title: string;
  artist: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  audioUrl: string;
  lyrics: LyricLine[];
  culturalContext?: string;
}

interface LyricLine {
  id: string;
  timestamp: number;
  originalText: string;
  translation: string;
  blanks: BlankWord[];
  isActive: boolean;
}

interface BlankWord {
  word: string;
  position: number;
  difficulty: number;
  alternatives: string[];
}
```

#### Mécanique de Jeu

##### Système de Score
```typescript
const calculateScore = () => {
  const totalWords = song.lyrics.reduce((sum, line) => sum + line.blanks.length, 0);
  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
  const accuracy = (correctAnswers / totalWords) * 100;
  
  // Bonus pour vitesse et séquence
  const speedBonus = Math.max(0, 100 - (averageResponseTime / 1000));
  const streakBonus = maxStreak * 5;
  
  return Math.min(100, accuracy + speedBonus + streakBonus);
};
```

##### Audio Synchronisé
```typescript
const syncLyricsWithAudio = () => {
  const currentTime = audioRef.current?.currentTime || 0;
  const activeLine = song.lyrics.find(line => 
    currentTime >= line.timestamp && 
    currentTime < (line.timestamp + lineDuration)
  );
  
  if (activeLine && activeLine.id !== currentLine?.id) {
    setCurrentLine(activeLine);
    highlightCurrentWords(activeLine);
  }
};
```

---

## 🛠️ Module d'Administration

### 🔧 Composant: `AdminPanel.tsx`

#### Interfaces d'Administration

```typescript
interface SystemStats {
  totalProfessors: number;
  totalStudents: number;
  totalReservations: number;
  monthlyRevenue: number;
  pendingApprovals: number;
  activeClasses: number;
}

interface ProfessorRequest {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  bio: string;
  certifications: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}
```

#### Fonctionnalités d'Administration

##### Validation des Professeurs
```typescript
const approveProfessor = async (requestId: string, approve: boolean) => {
  // 1. Mise à jour du statut
  // 2. Création du compte professeur si approuvé
  // 3. Envoi de notifications
  // 4. Configuration des permissions
  
  const updatedRequests = professorRequests.map(req => 
    req.id === requestId 
      ? { 
          ...req, 
          status: approve ? 'approved' : 'rejected',
          processedAt: new Date().toISOString(),
          processingNotes: approvalNotes
        }
      : req
  );
  
  setProfessorRequests(updatedRequests);
};
```

##### Analytics et Reporting
```typescript
const generateAnalytics = () => {
  return {
    revenue: {
      total: calculateTotalRevenue(),
      monthly: calculateMonthlyRevenue(),
      byProfessor: getRevenueByProfessor(),
      commission: calculatePlatformCommission()
    },
    usage: {
      activeUsers: getActiveUsers(),
      sessionDuration: getAverageSessionDuration(),
      completionRate: getCompletionRate(),
      retention: calculateRetention()
    },
    growth: {
      newUsers: getNewUsers(),
      churnRate: calculateChurnRate(),
      satisfaction: getAverageRating()
    }
  };
};
```

---

## 💰 Système de Monétisation

### 🔧 Service: `CreditManagementService.ts`

#### Gestion des Crédits

```typescript
interface CreditTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'spend' | 'refund' | 'bonus';
  amount: number;
  description: string;
  timestamp: string;
  relatedActivityId?: string;
  paymentMethodId?: string;
}

interface CreditPackage {
  id: string;
  credits: number;
  bonusCredits: number;
  price: number;
  currency: string;
  isPopular: boolean;
  discountPercent?: number;
}
```

#### API de Gestion

```typescript
class CreditManagementService {
  async purchaseCredits(userId: string, packageId: string, paymentMethodId: string) {
    // 1. Validation du package
    // 2. Traitement du paiement
    // 3. Attribution des crédits
    // 4. Historique transaction
    return { success: true, newBalance, transactionId };
  }

  async spendCredits(userId: string, amount: number, activityId: string) {
    // 1. Vérification du solde
    // 2. Validation de l'activité
    // 3. Débit des crédits
    // 4. Enregistrement transaction
    return { success: true, remainingBalance };
  }

  async validateSpending(userId: string, amount: number) {
    // Système anti-abus
    const userBalance = await this.getCreditBalance(userId);
    const recentSpending = await this.getRecentSpending(userId, 24); // 24h
    
    return {
      canSpend: userBalance >= amount && recentSpending < dailyLimit,
      reason: userBalance < amount ? 'insufficient_credits' : 'daily_limit_exceeded'
    };
  }
}
```

---

## 🔗 Intégrations Externes

### 📹 APIs Vidéo

#### Zoom Integration
```javascript
const createZoomMeeting = async (reservation, professor) => {
  const meetingData = {
    topic: `Cours Maya - ${professor.name}`,
    type: 2, // Scheduled meeting
    start_time: `${reservation.timeSlot.date}T${reservation.timeSlot.startTime}:00`,
    duration: calculateDuration(reservation.timeSlot),
    timezone: professor.timezone,
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: false,
      mute_upon_entry: true,
      watermark: false,
      audio: 'voip',
      auto_recording: 'none'
    }
  };

  const response = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${zoomAccessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(meetingData)
  });

  const meeting = await response.json();
  return meeting.join_url;
};
```

#### Google Meet Integration
```javascript
const createGoogleMeetLink = async (reservation, professor) => {
  // Utilisation de l'API Google Calendar pour créer un événement avec Meet
  const event = {
    summary: `Cours Maya - ${professor.name}`,
    start: {
      dateTime: `${reservation.timeSlot.date}T${reservation.timeSlot.startTime}:00`,
      timeZone: professor.timezone
    },
    end: {
      dateTime: `${reservation.timeSlot.date}T${reservation.timeSlot.endTime}:00`,
      timeZone: professor.timezone
    },
    conferenceData: {
      createRequest: {
        requestId: `meet-${reservation.id}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const result = await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1
  });

  return result.data.conferenceData?.entryPoints?.[0]?.uri;
};
```

### 💳 Stripe Payment Integration

```javascript
const processPayment = async (reservation) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: reservation.timeSlot.price * 100, // Centimes
      currency: 'eur',
      payment_method: reservation.paymentMethodId,
      confirm: true,
      metadata: {
        reservationId: reservation.id,
        studentId: reservation.studentId,
        professorId: reservation.professorId
      }
    });

    // Commission plateforme
    const platformFee = Math.floor(paymentIntent.amount * 0.1);
    const professorAmount = paymentIntent.amount - platformFee;

    // Transfer vers compte professeur
    await stripe.transfers.create({
      amount: professorAmount,
      currency: 'eur',
      destination: professor.stripeAccountId,
      transfer_group: reservation.id
    });

    return {
      success: true,
      paymentId: paymentIntent.id,
      amount: paymentIntent.amount,
      platformFee,
      professorAmount
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

---

## 📧 Système de Notifications

### Email Templates

```javascript
const emailTemplates = {
  reservation_created: {
    subject: 'Demande de cours envoyée - Talk Kin',
    html: `
      <h2>Votre demande de cours a été envoyée</h2>
      <p>Bonjour {{studentName}},</p>
      <p>Votre demande de cours avec {{professorName}} a été envoyée avec succès.</p>
      <p><strong>Détails:</strong></p>
      <ul>
        <li>Date: {{date}}</li>
        <li>Heure: {{time}}</li>
        <li>Matière: {{subject}}</li>
        <li>Prix: {{price}}€</li>
      </ul>
      <p>Vous recevrez une confirmation par email dès que le professeur aura accepté votre demande.</p>
    `
  },
  
  reservation_confirmed: {
    subject: 'Cours confirmé ! - Talk Kin',
    html: `
      <h2>Votre cours est confirmé !</h2>
      <p>Bonjour {{studentName}},</p>
      <p>Excellente nouvelle ! {{professorName}} a confirmé votre cours.</p>
      <p><strong>Lien de réunion:</strong></p>
      <p><a href="{{meetingLink}}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Rejoindre le cours</a></p>
      <p>Nous vous enverrons un rappel 1 heure avant le début du cours.</p>
    `
  }
};
```

### Push Notifications

```javascript
const sendPushNotification = async (userId, notification) => {
  const payload = {
    to: userDevice.pushToken,
    sound: 'default',
    title: notification.title,
    body: notification.body,
    data: notification.data,
    badge: await getUnreadNotificationCount(userId)
  };

  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  return response.json();
};
```

---

## 🔒 Sécurité et Validation

### Validation des Données

```typescript
const validateReservationData = (data: any) => {
  const schema = {
    studentId: { type: 'string', required: true },
    professorId: { type: 'string', required: true },
    timeSlotId: { type: 'string', required: true },
    meetingType: { type: 'string', enum: ['zoom', 'meet', 'teams'], required: true },
    paymentMethodId: { type: 'string', required: true }
  };

  return validateSchema(data, schema);
};
```

### Protection Anti-Fraude

```javascript
const detectFraudulentActivity = async (userId, activityData) => {
  const checks = [
    // Vérification fréquence réservations
    await checkReservationFrequency(userId),
    
    // Vérification patterns de paiement
    await checkPaymentPatterns(userId),
    
    // Vérification géolocalisation
    await checkGeolocation(userId, activityData.ipAddress),
    
    // Vérification device fingerprint
    await checkDeviceFingerprint(userId, activityData.deviceId)
  ];

  const riskScore = checks.reduce((sum, check) => sum + check.score, 0);
  
  return {
    isRisky: riskScore > FRAUD_THRESHOLD,
    riskScore,
    reasons: checks.filter(c => c.score > 0).map(c => c.reason)
  };
};
```

---

## 📱 Optimisations Performance

### Lazy Loading

```typescript
// Chargement lazy des composants lourds
const AdminPanel = React.lazy(() => import('./AdminPanel'));
const GamefiedLearningHub = React.lazy(() => import('./GamefiedLearningHub'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Router>
      <Route path="/admin" component={AdminPanel} />
      <Route path="/learn" component={GamefiedLearningHub} />
    </Router>
  </Suspense>
);
```

### Mise en Cache

```typescript
// Cache des données professeurs
const useProfesorCache = () => {
  const [cache, setCache] = useState(new Map());
  const [lastFetch, setLastFetch] = useState(0);
  
  const getCachedProfessors = async () => {
    const now = Date.now();
    if (now - lastFetch < CACHE_DURATION && cache.has('professors')) {
      return cache.get('professors');
    }
    
    const professors = await fetchProfessors();
    cache.set('professors', professors);
    setLastFetch(now);
    return professors;
  };
  
  return { getCachedProfessors };
};
```

### Optimisation Bundle

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        gamification: {
          test: /[\\/]components[\\/](GamefiedLearningHub|LyricsTraining)/,
          name: 'gamification',
          chunks: 'all',
        },
        tutoring: {
          test: /[\\/]components[\\/](TutoringReservationSystem|AdminPanel)/,
          name: 'tutoring',
          chunks: 'all',
        }
      }
    }
  }
};
```

---

## 🧪 Tests et Qualité

### Tests Unitaires

```typescript
// __tests__/TutoringReservationSystem.test.tsx
describe('TutoringReservationSystem', () => {
  it('should load professors on mount', async () => {
    render(<TutoringReservationSystem userId="test" userType="student" />);
    
    await waitFor(() => {
      expect(screen.getByText('Prof. María González')).toBeInTheDocument();
    });
  });
  
  it('should create reservation successfully', async () => {
    const mockOnReservationChange = jest.fn();
    render(
      <TutoringReservationSystem 
        userId="test" 
        userType="student"
        onReservationChange={mockOnReservationChange}
      />
    );
    
    // Simulation de réservation
    fireEvent.press(screen.getByText('Réserver'));
    
    await waitFor(() => {
      expect(mockOnReservationChange).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'pending'
        })
      );
    });
  });
});
```

### Tests d'Intégration

```typescript
// __tests__/integration/reservation-flow.test.tsx
describe('Reservation Flow Integration', () => {
  it('should complete full reservation workflow', async () => {
    // 1. Connexion utilisateur
    await loginUser('test@example.com');
    
    // 2. Recherche professeur
    await searchProfessors({ subject: 'Maya K\'iche\'' });
    
    // 3. Sélection créneau
    await selectTimeSlot('prof1', 'slot1');
    
    // 4. Paiement
    await processPayment('pm_test_card');
    
    // 5. Confirmation
    await waitFor(() => {
      expect(screen.getByText('Réservation confirmée')).toBeInTheDocument();
    });
  });
});
```

---

## 🚀 Déploiement et DevOps

### Configuration Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Pipeline CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy Talk Kin

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run lint
      - run: npm run type-check

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to staging
        run: |
          docker build -t talkkin:latest .
          docker push registry.talkkin.com/app:latest
```

### Monitoring

```javascript
// monitoring.js
const setupMonitoring = () => {
  // Métriques application
  const metrics = {
    reservations_created: new prometheus.Counter({
      name: 'reservations_created_total',
      help: 'Total number of reservations created'
    }),
    
    gamification_activities_completed: new prometheus.Counter({
      name: 'activities_completed_total',
      help: 'Total number of activities completed'
    }),
    
    payment_processing_duration: new prometheus.Histogram({
      name: 'payment_processing_seconds',
      help: 'Payment processing duration'
    })
  };

  // Health checks
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: checkDatabaseHealth(),
        stripe: checkStripeHealth(),
        zoom: checkZoomHealth()
      }
    });
  });
};
```

---

## 📊 Métriques et Analytics

### KPIs Techniques

- **Temps de réponse API**: < 200ms p95
- **Disponibilité**: > 99.9%
- **Taux d'erreur**: < 0.1%
- **Throughput**: 1000 req/sec
- **Utilisation mémoire**: < 80%
- **Utilisation CPU**: < 70%

### KPIs Business

- **Taux de conversion**: Visiteur → Utilisateur inscrit
- **Taux de rétention**: Utilisateurs actifs 7j/30j
- **Satisfaction utilisateur**: Note moyenne > 4.5/5
- **Revenus par utilisateur**: ARPU mensuel
- **Coût d'acquisition**: CAC < LTV/3

---

Cette documentation technique fournit une base solide pour l'équipe de développement et la maintenance continue de la plateforme Talk Kin. Toutes les fonctionnalités sont implémentées selon les meilleures pratiques et prêtes pour la production.

---

*Documentation technique générée le 25 juin 2025*
