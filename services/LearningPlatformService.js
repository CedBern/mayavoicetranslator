/**
 * 🎓 Service d'Apprentissage et Salle Virtuelle Talk Kin
 * Plateforme éducative pour l'apprentissage des langues indigènes
 */

class LearningPlatformService {
  constructor() {
    this.classrooms = new Map();
    this.users = new Map();
    this.courses = new Map();
    this.sessions = new Map();
    this.assignments = new Map();
    this.progress = new Map();
    
    this.userTypes = {
      STUDENT: 'student',
      TEACHER: 'teacher',
      ADMIN: 'admin'
    };
    
    this.sessionTypes = {
      LIVE_CLASS: 'live_class',
      PRACTICE: 'practice',
      ASSESSMENT: 'assessment',
      CULTURAL_IMMERSION: 'cultural_immersion'
    };
    
    this.languages = ['yua', 'qu', 'gn', 'nah', 'ay'];
    this.levels = ['débutant', 'intermédiaire', 'avancé', 'natif'];
    
    this.isInitialized = false;
  }

  /**
   * Initialise la plateforme d'apprentissage
   */
  async initialize() {
    try {
      console.log('🎓 Initialisation de la plateforme d\'apprentissage...');
      
      // Création des cours par défaut
      await this.createDefaultCourses();
      
      // Création d'utilisateurs de démonstration
      await this.createDemoUsers();
      
      // Création de salles de classe par défaut
      await this.createDefaultClassrooms();
      
      this.isInitialized = true;
      console.log('✅ Plateforme d\'apprentissage initialisée');
      
      return {
        status: 'initialized',
        courses: this.courses.size,
        classrooms: this.classrooms.size,
        users: this.users.size
      };
    } catch (error) {
      console.error('❌ Erreur initialisation:', error);
      throw error;
    }
  }

  /**
   * Crée les cours par défaut
   */
  async createDefaultCourses() {
    const defaultCourses = [
      {
        id: 'maya-yua-basic',
        name: 'Maya Yucatèque - Niveau Débutant',
        language: 'yua',
        level: 'débutant',
        description: 'Apprenez les bases de la langue maya yucatèque',
        duration: '8 semaines',
        modules: [
          {
            id: 'mod1',
            title: 'Salutations et présentations',
            lessons: [
              'Ba\'ax ka wa\'alik - Bonjour',
              'In k\'aaba\' - Mon nom est',
              'Bix a beel - Comment allez-vous'
            ]
          },
          {
            id: 'mod2',
            title: 'Famille et relations',
            lessons: [
              'Otoch - Famille',
              'Taata, Nana - Père, Mère',
              'Suku\'un, Saaki\'il - Frère, Sœur'
            ]
          },
          {
            id: 'mod3',
            title: 'Vie quotidienne',
            lessons: [
              'Janal - Nourriture',
              'Naj - Maison',
              'K\'iin - Soleil/Jour'
            ]
          }
        ],
        culturalContent: {
          calendar: 'Calendrier maya traditionnel',
          mythology: 'Histoires et légendes',
          ceremonies: 'Rituels et célébrations'
        }
      },
      {
        id: 'quechua-basic',
        name: 'Quechua - Niveau Débutant',
        language: 'qu',
        level: 'débutant',
        description: 'Découvrez la langue des Andes',
        duration: '6 semaines',
        modules: [
          {
            id: 'qmod1',
            title: 'Premières expressions',
            lessons: [
              'Rimaykullayki - Bonjour',
              'Añay - Merci',
              'Imaynallan - Comment ça va'
            ]
          }
        ]
      },
      {
        id: 'guarani-basic',
        name: 'Guaraní - Niveau Débutant',
        language: 'gn',
        level: 'débutant',
        description: 'Apprenez la langue du Paraguay',
        duration: '6 semaines',
        modules: [
          {
            id: 'gmod1',
            title: 'Expressions de base',
            lessons: [
              'Mba\'éichapa - Bonjour',
              'Aguyje - Merci',
              'Mba\'éichapa reiko - Comment ça va'
            ]
          }
        ]
      }
    ];

    for (const course of defaultCourses) {
      this.courses.set(course.id, {
        ...course,
        createdAt: new Date(),
        studentsEnrolled: 0,
        averageRating: 0,
        status: 'active'
      });
    }

    console.log(`📚 ${defaultCourses.length} cours créés`);
  }

  /**
   * Crée des utilisateurs de démonstration
   */
  async createDemoUsers() {
    const demoUsers = [
      {
        id: 'teacher-maya-1',
        name: 'Dr. Maria Itzamna',
        email: 'maria.itzamna@talkkin.edu',
        type: this.userTypes.TEACHER,
        specialties: ['yua', 'mayan-culture'],
        credentials: 'Ph.D. Linguistique Maya, Université du Yucatan',
        experience: '15 ans d\'enseignement',
        nativeLanguages: ['yua', 'es'],
        bio: 'Linguiste spécialisée dans la préservation des langues mayas'
      },
      {
        id: 'teacher-quechua-1',
        name: 'Prof. Carlos Amaru',
        email: 'carlos.amaru@talkkin.edu',
        type: this.userTypes.TEACHER,
        specialties: ['qu', 'andean-culture'],
        credentials: 'Master en Langues Indigènes, Universidad de Cusco',
        experience: '12 ans d\'enseignement',
        nativeLanguages: ['qu', 'es'],
        bio: 'Enseignant natif quechua, passionné de culture andine'
      },
      {
        id: 'student-demo-1',
        name: 'Sophie Dubois',
        email: 'sophie.dubois@student.talkkin.edu',
        type: this.userTypes.STUDENT,
        interests: ['maya-culture', 'language-preservation'],
        currentCourses: ['maya-yua-basic'],
        level: 'débutant',
        joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Il y a 30 jours
      }
    ];

    for (const user of demoUsers) {
      this.users.set(user.id, {
        ...user,
        createdAt: new Date(),
        lastActive: new Date(),
        progress: new Map(),
        achievements: [],
        totalStudyTime: 0
      });
    }

    console.log(`👥 ${demoUsers.length} utilisateurs créés`);
  }

  /**
   * Crée des salles de classe par défaut
   */
  async createDefaultClassrooms() {
    const defaultClassrooms = [
      {
        id: 'maya-virtual-room-1',
        name: 'Salle Maya Yucatèque - Niveau 1',
        language: 'yua',
        teacherId: 'teacher-maya-1',
        capacity: 20,
        description: 'Apprentissage interactif du maya yucatèque pour débutants',
        schedule: {
          days: ['lundi', 'mercredi', 'vendredi'],
          time: '18:00-19:30',
          timezone: 'Europe/Paris'
        },
        features: {
          audioSupport: true,
          videoSupport: true,
          whiteboard: true,
          culturalContent: true,
          gamification: true,
          pronunciation: true
        }
      },
      {
        id: 'quechua-virtual-room-1',
        name: 'Aula Virtual Quechua',
        language: 'qu',
        teacherId: 'teacher-quechua-1',
        capacity: 15,
        description: 'Cours de quechua avec immersion culturelle',
        schedule: {
          days: ['mardi', 'jeudi'],
          time: '19:00-20:30',
          timezone: 'Europe/Paris'
        },
        features: {
          audioSupport: true,
          videoSupport: true,
          whiteboard: true,
          culturalContent: true,
          gamification: true,
          pronunciation: true
        }
      }
    ];

    for (const classroom of defaultClassrooms) {
      this.classrooms.set(classroom.id, {
        ...classroom,
        createdAt: new Date(),
        students: [],
        sessions: [],
        status: 'active',
        totalSessions: 0,
        averageAttendance: 0
      });
    }

    console.log(`🏫 ${defaultClassrooms.length} salles de classe créées`);
  }

  /**
   * Inscrit un étudiant à un cours
   */
  async enrollStudent(studentId, courseId) {
    try {
      const student = this.users.get(studentId);
      const course = this.courses.get(courseId);

      if (!student || student.type !== this.userTypes.STUDENT) {
        throw new Error('Étudiant non trouvé');
      }

      if (!course) {
        throw new Error('Cours non trouvé');
      }

      // Mise à jour des données étudiant
      if (!student.currentCourses) student.currentCourses = [];
      if (!student.currentCourses.includes(courseId)) {
        student.currentCourses.push(courseId);
      }

      // Mise à jour du cours
      course.studentsEnrolled++;

      // Initialiser le progrès
      if (!this.progress.has(studentId)) {
        this.progress.set(studentId, new Map());
      }
      this.progress.get(studentId).set(courseId, {
        moduleProgress: {},
        lessonsCompleted: 0,
        totalLessons: this.getTotalLessons(course),
        startDate: new Date(),
        lastActivity: new Date(),
        score: 0
      });

      console.log(`✅ Étudiant ${student.name} inscrit au cours ${course.name}`);

      return {
        success: true,
        message: `Inscription réussie au cours ${course.name}`,
        course: course,
        student: student
      };

    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      throw error;
    }
  }

  /**
   * Crée une session d'apprentissage
   */
  async createLearningSession(teacherId, classroomId, sessionData) {
    try {
      const teacher = this.users.get(teacherId);
      const classroom = this.classrooms.get(classroomId);

      if (!teacher || teacher.type !== this.userTypes.TEACHER) {
        throw new Error('Professeur non autorisé');
      }

      if (!classroom) {
        throw new Error('Salle de classe non trouvée');
      }

      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const session = {
        id: sessionId,
        classroomId: classroomId,
        teacherId: teacherId,
        title: sessionData.title || 'Session d\'apprentissage',
        description: sessionData.description || '',
        type: sessionData.type || this.sessionTypes.LIVE_CLASS,
        scheduledTime: new Date(sessionData.scheduledTime),
        duration: sessionData.duration || 90, // minutes
        language: classroom.language,
        materials: sessionData.materials || [],
        activities: sessionData.activities || [],
        participants: [],
        status: 'scheduled',
        createdAt: new Date()
      };

      this.sessions.set(sessionId, session);
      classroom.sessions.push(sessionId);
      classroom.totalSessions++;

      console.log(`📅 Session créée: ${session.title}`);

      return {
        success: true,
        session: session,
        joinUrl: `/classroom/${classroomId}/session/${sessionId}`
      };

    } catch (error) {
      console.error('❌ Erreur création session:', error);
      throw error;
    }
  }

  /**
   * Rejoint une session d'apprentissage
   */
  async joinSession(userId, sessionId) {
    try {
      const user = this.users.get(userId);
      const session = this.sessions.get(sessionId);

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      if (!session) {
        throw new Error('Session non trouvée');
      }

      // Vérifier si l'utilisateur peut rejoindre
      const classroom = this.classrooms.get(session.classroomId);
      if (user.type === this.userTypes.STUDENT) {
        if (!classroom.students.includes(userId)) {
          throw new Error('Vous n\'êtes pas inscrit à cette classe');
        }
      }

      // Ajouter l'utilisateur à la session
      if (!session.participants.find(p => p.userId === userId)) {
        session.participants.push({
          userId: userId,
          name: user.name,
          type: user.type,
          joinedAt: new Date(),
          status: 'active'
        });
      }

      // Mise à jour de l'activité utilisateur
      user.lastActive = new Date();

      console.log(`👥 ${user.name} a rejoint la session ${session.title}`);

      return {
        success: true,
        session: session,
        userRole: user.type,
        classroomFeatures: classroom.features
      };

    } catch (error) {
      console.error('❌ Erreur rejoindre session:', error);
      throw error;
    }
  }

  /**
   * Démarre une session live
   */
  async startLiveSession(sessionId, teacherId) {
    try {
      const session = this.sessions.get(sessionId);
      
      if (!session) {
        throw new Error('Session non trouvée');
      }

      if (session.teacherId !== teacherId) {
        throw new Error('Seul le professeur peut démarrer la session');
      }

      session.status = 'live';
      session.startedAt = new Date();

      console.log(`🔴 Session live démarrée: ${session.title}`);

      return {
        success: true,
        message: 'Session démarrée',
        session: session,
        liveFeatures: {
          audio: true,
          video: true,
          screenShare: true,
          whiteboard: true,
          chat: true,
          polls: true,
          pronunciation: true
        }
      };

    } catch (error) {
      console.error('❌ Erreur démarrage session:', error);
      throw error;
    }
  }

  /**
   * Obtient le tableau de bord étudiant
   */
  getStudentDashboard(studentId) {
    try {
      const student = this.users.get(studentId);
      if (!student || student.type !== this.userTypes.STUDENT) {
        throw new Error('Étudiant non trouvé');
      }

      const studentProgress = this.progress.get(studentId) || new Map();
      const currentCourses = student.currentCourses || [];
      
      const dashboard = {
        student: {
          name: student.name,
          email: student.email,
          joinedAt: student.joinedAt,
          totalStudyTime: student.totalStudyTime || 0
        },
        courses: currentCourses.map(courseId => {
          const course = this.courses.get(courseId);
          const progress = studentProgress.get(courseId);
          return {
            id: courseId,
            name: course?.name,
            language: course?.language,
            progress: progress ? {
              completionPercentage: Math.round((progress.lessonsCompleted / progress.totalLessons) * 100),
              lessonsCompleted: progress.lessonsCompleted,
              totalLessons: progress.totalLessons,
              score: progress.score,
              lastActivity: progress.lastActivity
            } : null
          };
        }),
        upcomingSessions: this.getUpcomingSessions(studentId),
        achievements: student.achievements || [],
        stats: {
          coursesEnrolled: currentCourses.length,
          lessonsCompleted: Array.from(studentProgress.values()).reduce((total, p) => total + p.lessonsCompleted, 0),
          averageScore: this.calculateAverageScore(studentId)
        }
      };

      return dashboard;

    } catch (error) {
      console.error('❌ Erreur dashboard étudiant:', error);
      throw error;
    }
  }

  /**
   * Obtient le tableau de bord professeur
   */
  getTeacherDashboard(teacherId) {
    try {
      const teacher = this.users.get(teacherId);
      if (!teacher || teacher.type !== this.userTypes.TEACHER) {
        throw new Error('Professeur non trouvé');
      }

      const teacherClassrooms = Array.from(this.classrooms.values())
        .filter(classroom => classroom.teacherId === teacherId);

      const dashboard = {
        teacher: {
          name: teacher.name,
          email: teacher.email,
          specialties: teacher.specialties,
          experience: teacher.experience
        },
        classrooms: teacherClassrooms.map(classroom => ({
          id: classroom.id,
          name: classroom.name,
          language: classroom.language,
          studentsCount: classroom.students.length,
          capacity: classroom.capacity,
          totalSessions: classroom.totalSessions,
          averageAttendance: classroom.averageAttendance
        })),
        upcomingSessions: this.getTeacherUpcomingSessions(teacherId),
        stats: {
          totalStudents: teacherClassrooms.reduce((total, c) => total + c.students.length, 0),
          totalClassrooms: teacherClassrooms.length,
          totalSessions: teacherClassrooms.reduce((total, c) => total + c.totalSessions, 0),
          averageRating: teacher.averageRating || 0
        }
      };

      return dashboard;

    } catch (error) {
      console.error('❌ Erreur dashboard professeur:', error);
      throw error;
    }
  }

  /**
   * Obtient les sessions à venir pour un étudiant
   */
  getUpcomingSessions(studentId) {
    const now = new Date();
    const upcomingSessions = [];

    for (const session of this.sessions.values()) {
      if (session.scheduledTime > now && session.status === 'scheduled') {
        const classroom = this.classrooms.get(session.classroomId);
        if (classroom && classroom.students.includes(studentId)) {
          upcomingSessions.push({
            id: session.id,
            title: session.title,
            scheduledTime: session.scheduledTime,
            duration: session.duration,
            classroomName: classroom.name,
            language: session.language
          });
        }
      }
    }

    return upcomingSessions.sort((a, b) => a.scheduledTime - b.scheduledTime);
  }

  /**
   * Obtient les sessions à venir pour un professeur
   */
  getTeacherUpcomingSessions(teacherId) {
    const now = new Date();
    const upcomingSessions = [];

    for (const session of this.sessions.values()) {
      if (session.teacherId === teacherId && session.scheduledTime > now && session.status === 'scheduled') {
        const classroom = this.classrooms.get(session.classroomId);
        upcomingSessions.push({
          id: session.id,
          title: session.title,
          scheduledTime: session.scheduledTime,
          duration: session.duration,
          classroomName: classroom?.name,
          studentsCount: classroom?.students.length || 0
        });
      }
    }

    return upcomingSessions.sort((a, b) => a.scheduledTime - b.scheduledTime);
  }

  /**
   * Calcule la note moyenne d'un étudiant
   */
  calculateAverageScore(studentId) {
    const studentProgress = this.progress.get(studentId);
    if (!studentProgress) return 0;

    const scores = Array.from(studentProgress.values()).map(p => p.score);
    return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
  }

  /**
   * Obtient le nombre total de leçons d'un cours
   */
  getTotalLessons(course) {
    return course.modules.reduce((total, module) => total + module.lessons.length, 0);
  }

  /**
   * Obtient la liste des cours disponibles
   */
  getAvailableCourses() {
    return Array.from(this.courses.values()).map(course => ({
      id: course.id,
      name: course.name,
      language: course.language,
      level: course.level,
      description: course.description,
      duration: course.duration,
      studentsEnrolled: course.studentsEnrolled,
      averageRating: course.averageRating
    }));
  }

  /**
   * Obtient la liste des salles de classe
   */
  getClassrooms() {
    return Array.from(this.classrooms.values()).map(classroom => ({
      id: classroom.id,
      name: classroom.name,
      language: classroom.language,
      capacity: classroom.capacity,
      studentsCount: classroom.students.length,
      teacherName: this.users.get(classroom.teacherId)?.name,
      schedule: classroom.schedule
    }));
  }

  /**
   * Recherche d'utilisateurs
   */
  searchUsers(query, type = null) {
    const results = [];
    
    for (const user of this.users.values()) {
      if (type && user.type !== type) continue;
      
      if (user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type,
          specialties: user.specialties,
          nativeLanguages: user.nativeLanguages
        });
      }
    }
    
    return results;
  }

  /**
   * Obtient les statistiques de la plateforme
   */
  getPlatformStats() {
    const totalUsers = this.users.size;
    const students = Array.from(this.users.values()).filter(u => u.type === this.userTypes.STUDENT).length;
    const teachers = Array.from(this.users.values()).filter(u => u.type === this.userTypes.TEACHER).length;
    
    return {
      users: {
        total: totalUsers,
        students: students,
        teachers: teachers,
        activeToday: this.getActiveUsersToday()
      },
      courses: {
        total: this.courses.size,
        byLanguage: this.getCoursesByLanguage()
      },
      classrooms: {
        total: this.classrooms.size,
        active: Array.from(this.classrooms.values()).filter(c => c.status === 'active').length
      },
      sessions: {
        total: this.sessions.size,
        completed: Array.from(this.sessions.values()).filter(s => s.status === 'completed').length,
        upcoming: Array.from(this.sessions.values()).filter(s => s.status === 'scheduled').length
      }
    };
  }

  /**
   * Obtient le nombre d'utilisateurs actifs aujourd'hui
   */
  getActiveUsersToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from(this.users.values())
      .filter(user => user.lastActive >= today).length;
  }

  /**
   * Obtient les cours par langue
   */
  getCoursesByLanguage() {
    const byLanguage = {};
    
    for (const course of this.courses.values()) {
      if (!byLanguage[course.language]) {
        byLanguage[course.language] = 0;
      }
      byLanguage[course.language]++;
    }
    
    return byLanguage;
  }
}

// Instance globale
const learningPlatform = new LearningPlatformService();

export default learningPlatform;
