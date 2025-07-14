/**
 * 🎓 Service de Plateforme d'Apprentissage
 * Gestion des salles virtuelles, cours et interactions professeur-élèves
 */

class VirtualClassroomService {
  constructor() {
    this.classrooms = new Map();
    this.students = new Map();
    this.teachers = new Map();
    this.lessons = new Map();
    this.assignments = new Map();
    this.liveStreams = new Map();
    
    this.initializeDefaultData();
  }

  initializeDefaultData() {
    // Créer quelques salles virtuelles par défaut
    const defaultClassrooms = [
      {
        id: 'maya-101',
        name: 'Maya Yucatèque - Niveau Débutant',
        language: 'yua',
        teacher: 'prof-maya',
        capacity: 30,
        currentStudents: [],
        schedule: {
          monday: '09:00-10:30',
          wednesday: '09:00-10:30',
          friday: '09:00-10:30'
        },
        description: 'Apprenez les bases du Maya Yucatèque avec des locuteurs natifs',
        level: 'beginner',
        price: 15.99,
        currency: 'EUR'
      },
      {
        id: 'quechua-201',
        name: 'Quechua Intermédiaire',
        language: 'qu',
        teacher: 'prof-quechua',
        capacity: 25,
        currentStudents: [],
        schedule: {
          tuesday: '14:00-15:30',
          thursday: '14:00-15:30',
          saturday: '10:00-11:30'
        },
        description: 'Perfectionnez votre Quechua avec des exercices pratiques',
        level: 'intermediate',
        price: 19.99,
        currency: 'EUR'
      },
      {
        id: 'guarani-101',
        name: 'Guaraní - Introduction',
        language: 'gn',
        teacher: 'prof-guarani',
        capacity: 20,
        currentStudents: [],
        schedule: {
          monday: '16:00-17:30',
          wednesday: '16:00-17:30'
        },
        description: 'Découvrez la beauté du Guaraní paraguayen',
        level: 'beginner',
        price: 12.99,
        currency: 'EUR'
      }
    ];

    defaultClassrooms.forEach(classroom => {
      this.classrooms.set(classroom.id, classroom);
    });

    // Créer des professeurs par défaut
    const defaultTeachers = [
      {
        id: 'prof-maya',
        name: 'Itzel Ixchel',
        avatar: '👩‍🏫',
        languages: ['yua', 'es', 'en'],
        specialties: ['Pronunciation', 'Traditional Stories', 'Daily Conversation'],
        experience: '15 ans d\'enseignement',
        rating: 4.9,
        biography: 'Locutrice native Maya Yucatèque, spécialisée dans l\'enseignement traditionnel'
      },
      {
        id: 'prof-quechua',
        name: 'Amaru Quispe',
        avatar: '👨‍🏫',
        languages: ['qu', 'es', 'en'],
        specialties: ['Grammar', 'Cultural Context', 'Business Quechua'],
        experience: '12 ans d\'enseignement',
        rating: 4.8,
        biography: 'Professeur de Quechua avec une approche moderne et interactive'
      },
      {
        id: 'prof-guarani',
        name: 'Karai Vera',
        avatar: '👨‍🏫',
        languages: ['gn', 'es', 'pt'],
        specialties: ['Basic Conversation', 'Cultural Immersion', 'Music & Language'],
        experience: '8 ans d\'enseignement',
        rating: 4.7,
        biography: 'Passionné de culture Guaraní et d\'enseignement interactif'
      }
    ];

    defaultTeachers.forEach(teacher => {
      this.teachers.set(teacher.id, teacher);
    });
  }

  // Gestion des salles de classe
  async createClassroom(classroomData) {
    const classroom = {
      id: `classroom-${Date.now()}`,
      ...classroomData,
      createdAt: new Date().toISOString(),
      currentStudents: [],
      isActive: true,
      sessions: []
    };

    this.classrooms.set(classroom.id, classroom);
    return classroom;
  }

  async getClassroom(classroomId) {
    return this.classrooms.get(classroomId);
  }

  async getAllClassrooms() {
    return Array.from(this.classrooms.values()).filter(c => c.isActive);
  }

  async getClassroomsByLanguage(language) {
    return Array.from(this.classrooms.values())
      .filter(c => c.language === language && c.isActive);
  }

  // Gestion des inscriptions
  async enrollStudent(classroomId, studentId, paymentInfo) {
    const classroom = this.classrooms.get(classroomId);
    if (!classroom) {
      throw new Error('Salle de classe non trouvée');
    }

    if (classroom.currentStudents.length >= classroom.capacity) {
      throw new Error('Salle de classe complète');
    }

    if (classroom.currentStudents.includes(studentId)) {
      throw new Error('Étudiant déjà inscrit');
    }

    // Simuler le processus de paiement
    const payment = await this.processPayment(paymentInfo);
    if (!payment.success) {
      throw new Error('Échec du paiement');
    }

    classroom.currentStudents.push(studentId);
    
    const enrollment = {
      studentId,
      classroomId,
      enrolledAt: new Date().toISOString(),
      paymentId: payment.id,
      status: 'active'
    };

    return enrollment;
  }

  async unenrollStudent(classroomId, studentId) {
    const classroom = this.classrooms.get(classroomId);
    if (!classroom) {
      throw new Error('Salle de classe non trouvée');
    }

    const index = classroom.currentStudents.indexOf(studentId);
    if (index > -1) {
      classroom.currentStudents.splice(index, 1);
      return true;
    }
    return false;
  }

  // Gestion des sessions en direct
  async startLiveSession(classroomId, teacherId) {
    const classroom = this.classrooms.get(classroomId);
    if (!classroom) {
      throw new Error('Salle de classe non trouvée');
    }

    if (classroom.teacher !== teacherId) {
      throw new Error('Accès non autorisé');
    }

    const session = {
      id: `session-${Date.now()}`,
      classroomId,
      teacherId,
      startTime: new Date().toISOString(),
      isActive: true,
      participants: [teacherId],
      chatMessages: [],
      boardContent: '',
      recordings: []
    };

    this.liveStreams.set(session.id, session);
    classroom.sessions.push(session.id);

    return session;
  }

  async joinLiveSession(sessionId, userId, userType) {
    const session = this.liveStreams.get(sessionId);
    if (!session || !session.isActive) {
      throw new Error('Session non trouvée ou inactive');
    }

    const classroom = this.classrooms.get(session.classroomId);
    
    // Vérifier les permissions
    if (userType === 'student' && !classroom.currentStudents.includes(userId)) {
      throw new Error('Étudiant non inscrit à cette classe');
    }

    if (!session.participants.includes(userId)) {
      session.participants.push(userId);
    }

    return {
      sessionId,
      classroomInfo: classroom,
      teacherInfo: this.teachers.get(classroom.teacher),
      participantCount: session.participants.length
    };
  }

  async endLiveSession(sessionId, teacherId) {
    const session = this.liveStreams.get(sessionId);
    if (!session) {
      throw new Error('Session non trouvée');
    }

    const classroom = this.classrooms.get(session.classroomId);
    if (classroom.teacher !== teacherId) {
      throw new Error('Accès non autorisé');
    }

    session.isActive = false;
    session.endTime = new Date().toISOString();
    session.duration = new Date(session.endTime) - new Date(session.startTime);

    return session;
  }

  // Gestion du chat en temps réel
  async sendChatMessage(sessionId, userId, message) {
    const session = this.liveStreams.get(sessionId);
    if (!session || !session.isActive) {
      throw new Error('Session non trouvée ou inactive');
    }

    if (!session.participants.includes(userId)) {
      throw new Error('Utilisateur non participant');
    }

    const chatMessage = {
      id: `msg-${Date.now()}`,
      userId,
      message: message.text,
      timestamp: new Date().toISOString(),
      type: message.type || 'text',
      language: message.language || 'fr'
    };

    session.chatMessages.push(chatMessage);

    // Si c'est une traduction, ajouter la traduction
    if (message.needsTranslation && message.targetLanguage) {
      chatMessage.translation = await this.translateMessage(message.text, message.targetLanguage);
    }

    return chatMessage;
  }

  async translateMessage(text, targetLanguage) {
    // Intégration avec le service de traduction existant
    try {
      const response = await fetch('http://localhost:3000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          sourceLang: 'auto',
          targetLang: targetLanguage
        })
      });
      const result = await response.json();
      return result.translation;
    } catch (error) {
      return text; // Fallback to original text
    }
  }

  // Gestion des devoirs et exercices
  async createAssignment(classroomId, teacherId, assignmentData) {
    const classroom = this.classrooms.get(classroomId);
    if (!classroom || classroom.teacher !== teacherId) {
      throw new Error('Accès non autorisé');
    }

    const assignment = {
      id: `assignment-${Date.now()}`,
      classroomId,
      title: assignmentData.title,
      description: assignmentData.description,
      language: assignmentData.language,
      type: assignmentData.type, // 'translation', 'pronunciation', 'conversation'
      dueDate: assignmentData.dueDate,
      exercises: assignmentData.exercises || [],
      submissions: new Map(),
      createdAt: new Date().toISOString()
    };

    this.assignments.set(assignment.id, assignment);
    return assignment;
  }

  async submitAssignment(assignmentId, studentId, submission) {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) {
      throw new Error('Devoir non trouvé');
    }

    const studentSubmission = {
      studentId,
      submittedAt: new Date().toISOString(),
      content: submission.content,
      audioRecording: submission.audioRecording,
      status: 'submitted',
      grade: null,
      feedback: null
    };

    assignment.submissions.set(studentId, studentSubmission);
    return studentSubmission;
  }

  async gradeAssignment(assignmentId, studentId, teacherId, grade, feedback) {
    const assignment = this.assignments.get(assignmentId);
    if (!assignment) {
      throw new Error('Devoir non trouvé');
    }

    const classroom = this.classrooms.get(assignment.classroomId);
    if (!classroom || classroom.teacher !== teacherId) {
      throw new Error('Accès non autorisé');
    }

    const submission = assignment.submissions.get(studentId);
    if (!submission) {
      throw new Error('Soumission non trouvée');
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.gradedAt = new Date().toISOString();
    submission.status = 'graded';

    return submission;
  }

  // Statistiques et progrès
  async getStudentProgress(studentId, classroomId) {
    const classroom = this.classrooms.get(classroomId);
    if (!classroom) {
      throw new Error('Salle de classe non trouvée');
    }

    // Calculer les statistiques de l'étudiant
    const assignments = Array.from(this.assignments.values())
      .filter(a => a.classroomId === classroomId);
    
    const submissions = assignments
      .map(a => a.submissions.get(studentId))
      .filter(s => s);

    const completedAssignments = submissions.filter(s => s.status === 'graded');
    const averageGrade = completedAssignments.length > 0 
      ? completedAssignments.reduce((sum, s) => sum + s.grade, 0) / completedAssignments.length
      : 0;

    return {
      studentId,
      classroomId,
      totalAssignments: assignments.length,
      completedAssignments: completedAssignments.length,
      averageGrade,
      progress: assignments.length > 0 ? (completedAssignments.length / assignments.length) * 100 : 0,
      lastActivity: submissions.length > 0 
        ? Math.max(...submissions.map(s => new Date(s.submittedAt).getTime()))
        : null
    };
  }

  async getClassroomStats(classroomId) {
    const classroom = this.classrooms.get(classroomId);
    if (!classroom) {
      throw new Error('Salle de classe non trouvée');
    }

    const assignments = Array.from(this.assignments.values())
      .filter(a => a.classroomId === classroomId);

    const totalStudents = classroom.currentStudents.length;
    const totalSessions = classroom.sessions.length;
    
    // Calculer la participation moyenne
    const sessionData = classroom.sessions.map(sessionId => this.liveStreams.get(sessionId))
      .filter(s => s);
    
    const averageParticipation = sessionData.length > 0
      ? sessionData.reduce((sum, s) => sum + s.participants.length, 0) / sessionData.length
      : 0;

    return {
      classroomId,
      totalStudents,
      totalAssignments: assignments.length,
      totalSessions,
      averageParticipation,
      revenue: totalStudents * classroom.price,
      currency: classroom.currency
    };
  }

  // Méthode temporaire pour le paiement (sera remplacée par le vrai système)
  async processPayment(paymentInfo) {
    // Simulation du processus de paiement
    return {
      success: true,
      id: `payment-${Date.now()}`,
      amount: paymentInfo.amount,
      currency: paymentInfo.currency,
      method: paymentInfo.method,
      processedAt: new Date().toISOString()
    };
  }
}

export default VirtualClassroomService;
