import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, FlatList, Modal } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import SemanticSuggestions from './SemanticSuggestions';

interface Classroom {
  id: string;
  name: string;
  language: string;
  teacher: string;
  capacity: number;
  currentStudents: string[];
  schedule: Record<string, string>;
  description: string;
  level: string;
  price: number;
  currency: string;
}

interface Teacher {
  id: string;
  name: string;
  avatar: string;
  languages: string[];
  specialties: string[];
  experience: string;
  rating: number;
  biography: string;
}

export function LearningPlatformPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');

  useEffect(() => {
    loadClassrooms();
    loadTeachers();
  }, []);

  const loadClassrooms = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/learning/classrooms');
      const data = await response.json();
      setClassrooms(data.classrooms || []);
    } catch (error) {
      // Données de fallback
      setClassrooms([
        {
          id: 'maya-101',
          name: 'Maya Yucatèque - Niveau Débutant',
          language: 'yua',
          teacher: 'prof-maya',
          capacity: 30,
          currentStudents: ['student1', 'student2'],
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
          currentStudents: ['student1'],
          schedule: {
            tuesday: '14:00-15:30',
            thursday: '14:00-15:30',
            saturday: '10:00-11:30'
          },
          description: 'Perfectionnez votre Quechua avec des exercices pratiques',
          level: 'intermediate',
          price: 19.99,
          currency: 'EUR'
        }
      ]);
    }
    setLoading(false);
  };

  const loadTeachers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/learning/teachers');
      const data = await response.json();
      setTeachers(data.teachers || []);
    } catch (error) {
      // Données de fallback
      setTeachers([
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
        }
      ]);
    }
  };

  const enrollInClassroom = async (classroom: Classroom) => {
    try {
      Alert.alert(
        '🎓 Inscription au Cours',
        `Vous voulez vous inscrire à "${classroom.name}"?\n\nPrix: ${classroom.price}€\nCapacité: ${classroom.currentStudents.length}/${classroom.capacity}`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'S\'inscrire',
            onPress: async () => {
              const response = await fetch('http://localhost:3000/api/learning/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  classroomId: classroom.id,
                  studentId: 'current-user',
                  paymentInfo: {
                    amount: classroom.price,
                    currency: classroom.currency,
                    method: 'card'
                  }
                })
              });
              
              if (response.ok) {
                Alert.alert('✅ Inscription Réussie', 'Vous êtes maintenant inscrit au cours !');
                loadClassrooms(); // Recharger pour mettre à jour
              } else {
                Alert.alert('❌ Erreur', 'Impossible de s\'inscrire au cours');
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('❌ Erreur', 'Erreur lors de l\'inscription');
    }
  };

  const joinLiveSession = async (classroom: Classroom) => {
    try {
      // Vérifier s'il y a une session active
      const response = await fetch(`http://localhost:3000/api/learning/session/active/${classroom.id}`);
      
      if (response.ok) {
        const sessionData = await response.json();
        Alert.alert(
          '🔴 Session en Direct',
          `Rejoindre la session de "${classroom.name}"?\n\nParticipants: ${sessionData.participantCount}\nProfesseur: ${sessionData.teacherInfo?.name}`,
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Rejoindre',
              onPress: () => {
                Alert.alert('🎓 Session Rejointe', 'Redirection vers la salle virtuelle...');
                // Ici on redirigerait vers l'interface de session live
              }
            }
          ]
        );
      } else {
        Alert.alert('📅 Pas de Session Active', 'Aucune session n\'est en cours pour ce cours.');
      }
    } catch (error) {
      Alert.alert('🎓 Mode Démo', 'Fonctionnalité de session en direct disponible\n\n• Chat en temps réel\n• Tableau blanc partagé\n• Audio/Vidéo\n• Exercices interactifs');
    }
  };

  const startTeachingSession = async (classroom: Classroom) => {
    try {
      Alert.alert(
        '🎬 Démarrer Session',
        `Commencer une session pour "${classroom.name}"?\n\nÉtudiants inscrits: ${classroom.currentStudents.length}`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Démarrer',
            onPress: async () => {
              const response = await fetch('http://localhost:3000/api/learning/session/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  classroomId: classroom.id,
                  teacherId: 'current-teacher'
                })
              });
              
              if (response.ok) {
                Alert.alert('✅ Session Démarrée', 'La session est maintenant active !');
              } else {
                Alert.alert('🎓 Mode Démo', 'Session simulée démarrée\n\n• Interface professeur\n• Gestion des participants\n• Outils pédagogiques\n• Enregistrement automatique');
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('🎓 Mode Démo', 'Interface professeur disponible');
    }
  };
  const getLanguageFlag = (langCode: string) => {
    const flags: Record<string, string> = {
      'yua': '🏛️',
      'qu': '🏔️',
      'gn': '🌿',
      'nah': '🦅',
      'ay': '⛰️'
    };
    return flags[langCode] || '🌍';
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'beginner': '#4CAF50',
      'intermediate': '#FF9800',
      'advanced': '#F44336'
    };
    return colors[level] || '#2196F3';
  };

  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = classroom.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                         classroom.description.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesLanguage = languageFilter === 'all' || classroom.language === languageFilter;
    return matchesSearch && matchesLanguage;
  });

  const renderClassroomCard = ({ item: classroom }: { item: Classroom }) => {
    const teacher = teachers.find(t => t.id === classroom.teacher);
    const isEnrolled = classroom.currentStudents.includes('current-user');
    
    return (
      <ThemedView style={styles.classroomCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.classroomFlag}>{getLanguageFlag(classroom.language)}</Text>
          <View style={styles.cardHeaderText}>
            <ThemedText style={styles.classroomName}>{classroom.name}</ThemedText>
            <View style={styles.levelBadge}>
              <Text style={[styles.levelText, { backgroundColor: getLevelColor(classroom.level) }]}>
                {classroom.level.toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.priceText}>{classroom.price}€</Text>
        </View>

        <ThemedText style={styles.description}>{classroom.description}</ThemedText>

        {teacher && (
          <View style={styles.teacherInfo}>
            <Text style={styles.teacherAvatar}>{teacher.avatar}</Text>
            <View>
              <ThemedText style={styles.teacherName}>{teacher.name}</ThemedText>
              <ThemedText style={styles.teacherExperience}>⭐ {teacher.rating} • {teacher.experience}</ThemedText>
            </View>
          </View>
        )}

        <View style={styles.scheduleContainer}>
          <ThemedText style={styles.scheduleTitle}>📅 Horaires:</ThemedText>          {Object.entries(classroom.schedule).map(([day, time]) => (
            <ThemedText key={day} style={styles.scheduleItem}>
              {day}: {String(time)}
            </ThemedText>
          ))}
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statItem}>👥 {classroom.currentStudents.length}/{classroom.capacity}</Text>
          <Text style={styles.statItem}>🌍 {classroom.language.toUpperCase()}</Text>
        </View>

        <View style={styles.actionButtons}>
          {userRole === 'student' && (
            <>
              {!isEnrolled ? (
                <TouchableOpacity
                  style={styles.enrollButton}
                  onPress={() => enrollInClassroom(classroom)}
                >
                  <Text style={styles.buttonText}>S'inscrire</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => joinLiveSession(classroom)}
                >
                  <Text style={styles.buttonText}>Rejoindre</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {userRole === 'teacher' && classroom.teacher === 'current-teacher' && (
            <TouchableOpacity
              style={styles.teachButton}
              onPress={() => startTeachingSession(classroom)}
            >
              <Text style={styles.buttonText}>Enseigner</Text>
            </TouchableOpacity>
          )}
        </View>
      </ThemedView>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.loadingText}>🎓 Chargement des cours...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>🎓 Plateforme d'Apprentissage</ThemedText>
          <ThemedText style={styles.subtitle}>Salles virtuelles pour langues indigènes</ThemedText>
          
          {/* Switch Utilisateur */}
          <View style={styles.roleSwitch}>
            <TouchableOpacity
              style={[styles.roleButton, userRole === 'student' && styles.activeRole]}
              onPress={() => setUserRole('student')}
            >
              <Text style={styles.roleText}>👨‍🎓 Étudiant</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, userRole === 'teacher' && styles.activeRole]}
              onPress={() => setUserRole('teacher')}
            >
              <Text style={styles.roleText}>👩‍🏫 Professeur</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filtres */}
        <View style={styles.filtersContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Rechercher un cours..."
            value={searchFilter}
            onChangeText={setSearchFilter}
          />
          {/* Suggestions sémantiques contextuelles */}
          <SemanticSuggestions
            query={searchFilter}
            language={languageFilter}
            jwtToken={''} // TODO: Remplacer par le vrai JWT utilisateur
            apiServerUrl={process.env.API_SERVER_URL || 'http://localhost:3000'}
            onSuggestionSelect={setSearchFilter}
          />
          <ScrollView horizontal style={styles.languageFilters}>
            {['all', 'yua', 'qu', 'gn', 'nah', 'ay'].map(lang => (
              <TouchableOpacity
                key={lang}
                style={[styles.filterButton, languageFilter === lang && styles.activeFilter]}
                onPress={() => setLanguageFilter(lang)}
              >
                <Text style={styles.filterText}>
                  {lang === 'all' ? '🌍 Tout' : `${getLanguageFlag(lang)} ${lang.toUpperCase()}`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Statistiques Rapides */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{classrooms.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Cours Disponibles</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>{teachers.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Professeurs</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statNumber}>
              {classrooms.reduce((sum, c) => sum + c.currentStudents.length, 0)}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Étudiants Actifs</ThemedText>
          </View>
        </View>

        {/* Liste des Cours */}
        <ThemedText style={styles.sectionTitle}>📚 Cours Disponibles</ThemedText>
        
        <FlatList
          data={filteredClassrooms}
          renderItem={renderClassroomCard}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />

        {filteredClassrooms.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              🔍 Aucun cours trouvé pour vos critères
            </ThemedText>
          </View>
        )}

        {/* Actions Rapides */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => Alert.alert('🎯 Recommandations', 'Cours recommandés basés sur votre niveau')}
          >
            <ThemedText style={styles.actionIcon}>🎯</ThemedText>
            <ThemedText style={styles.actionTitle}>Recommandations</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => Alert.alert('📊 Progrès', 'Voir votre progression dans tous les cours')}
          >
            <ThemedText style={styles.actionIcon}>📊</ThemedText>
            <ThemedText style={styles.actionTitle}>Mon Progrès</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => Alert.alert('🏆 Certificats', 'Gérer vos certificats et réalisations')}
          >
            <ThemedText style={styles.actionIcon}>🏆</ThemedText>
            <ThemedText style={styles.actionTitle}>Certificats</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1,
    padding: 16
  },
  header: {
    marginBottom: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 20
  },
  roleSwitch: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 25,
    padding: 4
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center'
  },
  activeRole: {
    backgroundColor: '#2196F3'
  },
  roleText: {
    color: '#333',
    fontWeight: '600'
  },
  filtersContainer: {
    marginBottom: 20
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10
  },
  languageFilters: {
    flexDirection: 'row'
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  activeFilter: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3'
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500'
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3'
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  classroomCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  classroomFlag: {
    fontSize: 24,
    marginRight: 12
  },
  cardHeaderText: {
    flex: 1
  },
  classroomName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  levelBadge: {
    alignSelf: 'flex-start'
  },
  levelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden'
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50'
  },
  description: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
    lineHeight: 20
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8
  },
  teacherAvatar: {
    fontSize: 20,
    marginRight: 10
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '600'
  },
  teacherExperience: {
    fontSize: 12,
    opacity: 0.7
  },
  scheduleContainer: {
    marginBottom: 12
  },
  scheduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4
  },
  scheduleItem: {
    fontSize: 12,
    opacity: 0.8,
    marginLeft: 10
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  statItem: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  enrollButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5
  },
  joinButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5
  },
  teachButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  quickActions: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 2,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center'
  },
  emptyState: {
    padding: 40,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center'
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50
  }
});
