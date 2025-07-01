/**
 * Service de gestion des réservations de cours particuliers
 * Gère la planification, confirmation, annulation et paiements
 */

class TutoringReservationService {
  constructor() {
    this.reservations = new Map();
    this.professors = new Map();
    this.students = new Map();
    this.availability = new Map();
    this.notifications = [];
    
    // Configuration des intégrations
    this.integrations = {
      zoom: {
        apiKey: process.env.ZOOM_API_KEY,
        apiSecret: process.env.ZOOM_API_SECRET,
        baseUrl: 'https://api.zoom.us/v2'
      },
      googleMeet: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      },
      teams: {
        tenantId: process.env.TEAMS_TENANT_ID,
        clientId: process.env.TEAMS_CLIENT_ID
      },
      stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
      },
      email: {
        service: 'gmail',
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD
      }
    };

    this.initializeDefaultData();
  }

  initializeDefaultData() {
    // Professeurs par défaut
    const defaultProfessors = [
      {
        id: 'prof-1',
        name: 'Prof. María González',
        email: 'maria@talkkin.com',
        subjects: ['Maya K\'iche\'', 'Grammaire Maya', 'Culture Maya'],
        hourlyRate: 25,
        rating: 4.8,
        totalSessions: 156,
        bio: 'Professeure native avec 10 ans d\'expérience en enseignement du Maya K\'iche\'',
        languages: ['Maya K\'iche\'', 'Español', 'English', 'Français'],
        certifications: ['Certificat UNESCO Langues Indigènes', 'Master en Linguistique Maya'],
        timezone: 'America/Guatemala',
        paymentInfo: {
          accountType: 'stripe',
          accountId: 'acct_1234567890'
        },
        settings: {
          autoConfirm: false,
          cancellationPolicy: 24, // heures
          bufferTime: 15 // minutes entre les cours
        }
      },
      {
        id: 'prof-2',
        name: 'Prof. Ixchel Tum',
        email: 'ixchel@talkkin.com',
        subjects: ['Maya Yucatèque', 'Histoire Maya', 'Astronomie Maya'],
        hourlyRate: 30,
        rating: 4.9,
        totalSessions: 203,
        bio: 'Spécialiste en Maya Yucatèque et traditions astronomiques mayas',
        languages: ['Maya Yucatèque', 'Español', 'English'],
        certifications: ['Doctorat en Études Mayas', 'Certificat Observatoire Chichen Itza'],
        timezone: 'America/Merida',
        paymentInfo: {
          accountType: 'stripe',
          accountId: 'acct_0987654321'
        },
        settings: {
          autoConfirm: true,
          cancellationPolicy: 12,
          bufferTime: 10
        }
      }
    ];

    defaultProfessors.forEach(prof => this.professors.set(prof.id, prof));
  }

  // Gestion des professeurs
  async registerProfessor(professorData) {
    try {
      const professorId = `prof-${Date.now()}`;
      const professor = {
        id: professorId,
        ...professorData,
        rating: 0,
        totalSessions: 0,
        createdAt: new Date().toISOString(),
        status: 'pending' // en attente de validation
      };

      this.professors.set(professorId, professor);
      
      // Notification à l'équipe d'administration
      await this.sendNotification('admin', {
        type: 'professor_registration',
        professor: professor,
        message: `Nouveau professeur inscrit: ${professor.name}`
      });

      return {
        success: true,
        professorId,
        message: 'Inscription réussie. Votre profil sera validé sous 24h.'
      };
    } catch (error) {
      console.error('Erreur inscription professeur:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'inscription'
      };
    }
  }

  async updateProfessorAvailability(professorId, availability) {
    try {
      const professor = this.professors.get(professorId);
      if (!professor) {
        throw new Error('Professeur non trouvé');
      }

      // Validation des créneaux
      const validatedSlots = availability.map(slot => {
        return {
          id: slot.id || `slot-${Date.now()}-${Math.random()}`,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: true,
          price: slot.price || professor.hourlyRate,
          subject: slot.subject,
          maxStudents: slot.maxStudents || 1,
          type: slot.type || 'individual', // individual, group, workshop
          difficulty: slot.difficulty || 'beginner' // beginner, intermediate, advanced
        };
      });

      this.availability.set(professorId, validatedSlots);

      return {
        success: true,
        message: 'Disponibilités mises à jour'
      };
    } catch (error) {
      console.error('Erreur mise à jour disponibilités:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Gestion des réservations
  async createReservation(reservationData) {
    try {
      const {
        studentId,
        professorId,
        timeSlotId,
        meetingType,
        notes,
        paymentMethodId
      } = reservationData;

      // Vérifications
      const professor = this.professors.get(professorId);
      if (!professor) {
        throw new Error('Professeur non trouvé');
      }

      const availability = this.availability.get(professorId) || [];
      const timeSlot = availability.find(slot => slot.id === timeSlotId);
      if (!timeSlot || !timeSlot.isAvailable) {
        throw new Error('Créneau non disponible');
      }

      // Création de la réservation
      const reservationId = `res-${Date.now()}`;
      const reservation = {
        id: reservationId,
        studentId,
        professorId,
        timeSlot,
        meetingType,
        notes,
        status: professor.settings.autoConfirm ? 'confirmed' : 'pending',
        paymentStatus: 'pending',
        paymentMethodId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Tentative de paiement
      if (paymentMethodId) {
        const paymentResult = await this.processPayment(reservation);
        if (!paymentResult.success) {
          throw new Error('Échec du paiement');
        }
        reservation.paymentStatus = 'paid';
        reservation.paymentId = paymentResult.paymentId;
      }

      this.reservations.set(reservationId, reservation);

      // Marquer le créneau comme indisponible
      timeSlot.isAvailable = false;
      timeSlot.reservationId = reservationId;

      // Générer le lien de réunion si auto-confirmé
      if (reservation.status === 'confirmed') {
        reservation.meetingLink = await this.generateMeetingLink(reservation);
      }

      // Notifications
      await this.sendReservationNotifications(reservation);

      return {
        success: true,
        reservation,
        message: professor.settings.autoConfirm 
          ? 'Cours confirmé automatiquement' 
          : 'Demande envoyée au professeur'
      };
    } catch (error) {
      console.error('Erreur création réservation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async confirmReservation(reservationId, professorId, meetingLink = null) {
    try {
      const reservation = this.reservations.get(reservationId);
      if (!reservation) {
        throw new Error('Réservation non trouvée');
      }

      if (reservation.professorId !== professorId) {
        throw new Error('Non autorisé');
      }

      // Générer le lien de réunion si non fourni
      if (!meetingLink) {
        meetingLink = await this.generateMeetingLink(reservation);
      }

      reservation.status = 'confirmed';
      reservation.meetingLink = meetingLink;
      reservation.confirmedAt = new Date().toISOString();
      reservation.updatedAt = new Date().toISOString();

      // Traitement du paiement si pas encore fait
      if (reservation.paymentStatus === 'pending' && reservation.paymentMethodId) {
        const paymentResult = await this.processPayment(reservation);
        if (paymentResult.success) {
          reservation.paymentStatus = 'paid';
          reservation.paymentId = paymentResult.paymentId;
        }
      }

      // Notifications
      await this.sendConfirmationNotifications(reservation);

      return {
        success: true,
        reservation,
        message: 'Cours confirmé'
      };
    } catch (error) {
      console.error('Erreur confirmation réservation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async cancelReservation(reservationId, userId, reason, userType = 'student') {
    try {
      const reservation = this.reservations.get(reservationId);
      if (!reservation) {
        throw new Error('Réservation non trouvée');
      }

      // Vérifications d'autorisation
      if (userType === 'student' && reservation.studentId !== userId) {
        throw new Error('Non autorisé');
      }
      if (userType === 'professor' && reservation.professorId !== userId) {
        throw new Error('Non autorisé');
      }

      // Vérification politique d'annulation
      const professor = this.professors.get(reservation.professorId);
      const hoursUntilSession = this.getHoursUntilSession(reservation.timeSlot);
      
      if (hoursUntilSession < professor.settings.cancellationPolicy && userType === 'student') {
        throw new Error(`Annulation impossible moins de ${professor.settings.cancellationPolicy}h avant le cours`);
      }

      reservation.status = 'cancelled';
      reservation.cancellationReason = reason;
      reservation.cancelledBy = userType;
      reservation.cancelledAt = new Date().toISOString();
      reservation.updatedAt = new Date().toISOString();

      // Libérer le créneau
      const availability = this.availability.get(reservation.professorId) || [];
      const timeSlot = availability.find(slot => slot.id === reservation.timeSlot.id);
      if (timeSlot) {
        timeSlot.isAvailable = true;
        delete timeSlot.reservationId;
      }

      // Remboursement si applicable
      if (reservation.paymentStatus === 'paid') {
        const refundResult = await this.processRefund(reservation, hoursUntilSession);
        if (refundResult.success) {
          reservation.paymentStatus = 'refunded';
          reservation.refundId = refundResult.refundId;
        }
      }

      // Notifications
      await this.sendCancellationNotifications(reservation);

      return {
        success: true,
        reservation,
        message: 'Cours annulé'
      };
    } catch (error) {
      console.error('Erreur annulation réservation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Génération de liens de réunion
  async generateMeetingLink(reservation) {
    const { meetingType, timeSlot, professorId } = reservation;
    const professor = this.professors.get(professorId);

    try {
      switch (meetingType) {
        case 'zoom':
          return await this.createZoomMeeting(reservation, professor);
        case 'meet':
          return await this.createGoogleMeetLink(reservation, professor);
        case 'teams':
          return await this.createTeamsMeeting(reservation, professor);
        default:
          return `https://meet.talkkin.com/room/${reservation.id}`;
      }
    } catch (error) {
      console.error('Erreur génération lien:', error);
      // Fallback vers notre propre système
      return `https://meet.talkkin.com/room/${reservation.id}`;
    }
  }

  async createZoomMeeting(reservation, professor) {
    try {
      const meetingData = {
        topic: `Cours Maya - ${professor.name}`,
        type: 2, // Scheduled meeting
        start_time: `${reservation.timeSlot.date}T${reservation.timeSlot.startTime}:00`,
        duration: this.calculateDuration(reservation.timeSlot),
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

      // Simulation - remplacer par vraie API Zoom
      const meetingResponse = {
        join_url: `https://zoom.us/j/${Math.random().toString().substring(2, 12)}`,
        id: Math.random().toString().substring(2, 12),
        password: Math.random().toString(36).substring(2, 8)
      };

      return meetingResponse.join_url;
    } catch (error) {
      throw new Error('Erreur création réunion Zoom');
    }
  }

  async createGoogleMeetLink(reservation, professor) {
    // Génération d'un lien Google Meet
    const meetId = Math.random().toString(36).substring(2, 12);
    return `https://meet.google.com/${meetId}`;
  }

  async createTeamsMeeting(reservation, professor) {
    // Génération d'un lien Microsoft Teams
    const meetId = Math.random().toString(36).substring(2, 15);
    return `https://teams.microsoft.com/l/meetup-join/${meetId}`;
  }

  // Gestion des paiements
  async processPayment(reservation) {
    try {
      const amount = reservation.timeSlot.price * 100; // Stripe utilise les centimes
      
      // Simulation Stripe - remplacer par vraie API
      const paymentIntent = {
        id: `pi_${Math.random().toString(36).substring(2, 15)}`,
        amount,
        status: 'succeeded',
        created: Math.floor(Date.now() / 1000)
      };

      // Commission plateforme (10%)
      const platformFee = Math.floor(amount * 0.1);
      const professorAmount = amount - platformFee;

      return {
        success: true,
        paymentId: paymentIntent.id,
        amount,
        platformFee,
        professorAmount
      };
    } catch (error) {
      console.error('Erreur paiement:', error);
      return {
        success: false,
        error: 'Échec du paiement'
      };
    }
  }

  async processRefund(reservation, hoursUntilSession) {
    try {
      let refundAmount = reservation.timeSlot.price;
      
      // Politique de remboursement
      if (hoursUntilSession < 12) {
        refundAmount = refundAmount * 0.5; // 50% si moins de 12h
      } else if (hoursUntilSession < 24) {
        refundAmount = refundAmount * 0.75; // 75% si moins de 24h
      }
      // 100% si plus de 24h

      // Simulation remboursement
      const refund = {
        id: `re_${Math.random().toString(36).substring(2, 15)}`,
        amount: refundAmount * 100,
        status: 'succeeded'
      };

      return {
        success: true,
        refundId: refund.id,
        refundAmount
      };
    } catch (error) {
      console.error('Erreur remboursement:', error);
      return {
        success: false,
        error: 'Échec du remboursement'
      };
    }
  }

  // Notifications
  async sendReservationNotifications(reservation) {
    try {
      const professor = this.professors.get(reservation.professorId);
      
      // Email au professeur
      await this.sendEmail({
        to: professor.email,
        subject: 'Nouvelle demande de cours',
        template: 'new_reservation',
        data: { reservation, professor }
      });

      // Notification push au professeur
      await this.sendPushNotification(reservation.professorId, {
        title: 'Nouvelle demande de cours',
        body: `Demande pour le ${reservation.timeSlot.date} à ${reservation.timeSlot.startTime}`,
        data: { type: 'new_reservation', reservationId: reservation.id }
      });

      // Email de confirmation à l'étudiant
      await this.sendEmail({
        to: reservation.studentEmail,
        subject: 'Demande de cours envoyée',
        template: 'reservation_created',
        data: { reservation, professor }
      });
    } catch (error) {
      console.error('Erreur envoi notifications:', error);
    }
  }

  async sendConfirmationNotifications(reservation) {
    try {
      const professor = this.professors.get(reservation.professorId);

      // Email à l'étudiant avec lien de réunion
      await this.sendEmail({
        to: reservation.studentEmail,
        subject: 'Cours confirmé !',
        template: 'reservation_confirmed',
        data: { reservation, professor }
      });

      // Rappel calendrier
      await this.sendCalendarInvite(reservation);

      // Notification push
      await this.sendPushNotification(reservation.studentId, {
        title: 'Cours confirmé',
        body: `Votre cours avec ${professor.name} est confirmé`,
        data: { type: 'reservation_confirmed', reservationId: reservation.id }
      });
    } catch (error) {
      console.error('Erreur notifications confirmation:', error);
    }
  }

  async sendCancellationNotifications(reservation) {
    try {
      const professor = this.professors.get(reservation.professorId);
      const otherParty = reservation.cancelledBy === 'student' ? professor.email : reservation.studentEmail;

      await this.sendEmail({
        to: otherParty,
        subject: 'Cours annulé',
        template: 'reservation_cancelled',
        data: { reservation, professor }
      });
    } catch (error) {
      console.error('Erreur notifications annulation:', error);
    }
  }

  // Utilitaires
  calculateDuration(timeSlot) {
    const start = new Date(`2000-01-01T${timeSlot.startTime}:00`);
    const end = new Date(`2000-01-01T${timeSlot.endTime}:00`);
    return Math.floor((end - start) / (1000 * 60)); // en minutes
  }

  getHoursUntilSession(timeSlot) {
    const sessionTime = new Date(`${timeSlot.date}T${timeSlot.startTime}:00`);
    const now = new Date();
    return Math.floor((sessionTime - now) / (1000 * 60 * 60));
  }

  // APIs
  async getProfessors(filters = {}) {
    let professors = Array.from(this.professors.values());
    
    if (filters.subject) {
      professors = professors.filter(p => 
        p.subjects.some(s => s.toLowerCase().includes(filters.subject.toLowerCase()))
      );
    }
    
    if (filters.minRating) {
      professors = professors.filter(p => p.rating >= filters.minRating);
    }
    
    if (filters.maxRate) {
      professors = professors.filter(p => p.hourlyRate <= filters.maxRate);
    }

    return professors.map(p => ({
      ...p,
      availability: this.availability.get(p.id) || []
    }));
  }

  async getReservations(userId, userType) {
    const reservations = Array.from(this.reservations.values());
    
    if (userType === 'student') {
      return reservations.filter(r => r.studentId === userId);
    } else if (userType === 'professor') {
      return reservations.filter(r => r.professorId === userId);
    }
    
    return [];
  }

  async getAnalytics(professorId) {
    const reservations = Array.from(this.reservations.values())
      .filter(r => r.professorId === professorId);

    const totalSessions = reservations.filter(r => r.status === 'completed').length;
    const totalRevenue = reservations
      .filter(r => r.paymentStatus === 'paid')
      .reduce((sum, r) => sum + r.timeSlot.price, 0);

    return {
      totalSessions,
      totalRevenue,
      averageRating: this.professors.get(professorId)?.rating || 0,
      upcomingSessions: reservations.filter(r => 
        r.status === 'confirmed' && 
        new Date(`${r.timeSlot.date}T${r.timeSlot.startTime}:00`) > new Date()
      ).length
    };
  }

  // Méthodes de simulation pour les emails et notifications
  async sendEmail(emailData) {
    console.log(`📧 Email envoyé à ${emailData.to}: ${emailData.subject}`);
    return { success: true };
  }

  async sendPushNotification(userId, notification) {
    console.log(`🔔 Notification push à ${userId}: ${notification.title}`);
    return { success: true };
  }

  async sendCalendarInvite(reservation) {
    console.log(`📅 Invite calendrier envoyée pour la réservation ${reservation.id}`);
    return { success: true };
  }
}

module.exports = TutoringReservationService;
