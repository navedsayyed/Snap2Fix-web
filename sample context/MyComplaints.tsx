import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../styles/colors';
import { Card } from '../../components/common/Card';
import { 
  ClockIcon,
  CheckCircleIcon,
  MapPinIcon,
  CalendarIcon,
  BellIcon,
  BadgedBellIcon
} from '../../components/common/icons';
import { getCurrentUser, getComplaints } from '../../config/supabaseClient';
import { useNotificationBadge } from '../../hooks/useNotificationBadge';

interface Complaint {
  id: string;
  title: string;
  type: string;
  description: string;
  location: string;
  place: string;
  date: string;
  status: string;
  image: string | null;
  images: string[];
  completedImage: string | null;
  completedAt: string | null;
  completedNotes: string | null;
}

interface User {
  id: string;
  email?: string;
}

type RootStackParamList = {
  UserComplaintDetail: { complaint: Complaint };
  Tasks: undefined;
};

type TasksScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tasks'>;

interface TasksScreenProps {
  navigation: TasksScreenNavigationProp;
}

const MyComplaints: React.FC<TasksScreenProps> = ({ navigation }) => {
  const [complaintsTab, setComplaintsTab] = useState<'in-progress' | 'completed'>('in-progress');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Notification badge hook
  const { unreadCount, refreshCount } = useNotificationBadge(currentUser?.id || null, 'user');

  // Refresh notification count when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (currentUser?.id) {
        refreshCount();
      }
    }, [currentUser?.id, refreshCount])
  );

  useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        const { user, error } = await getCurrentUser();
        if (error) {
          Alert.alert('Error', 'Unable to load your account.');
          return;
        }
        if (!user) {
          Alert.alert('Session expired', 'Please sign in again.');
          return;
        }
        setCurrentUser(user);
      } catch (err) {
        console.error('TasksScreen init error:', err);
        Alert.alert('Error', 'Failed to fetch user info.');
      }
    };

    init();
  }, []);

  const fetchComplaints = useCallback(async (isRefreshing: boolean = false): Promise<void> => {
    if (!currentUser) return;

    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const status = complaintsTab === 'in-progress' ? 'in-progress' : 'completed';
      const { data, error } = await getComplaints(currentUser.id, status);

      if (error) {
        console.error('TasksScreen complaints error:', error);
        Alert.alert('Error', 'Failed to load complaints.');
        return;
      }

      const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
        const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        return `${dateStr} at ${timeStr}`;
      };

      const formatted: Complaint[] = data.map((complaint: any) => {
        // Try to get image from complaint_images table first, then fallback to legacy image field
        const imageUrl = complaint.complaint_images?.[0]?.url || complaint.image || null;
        const allImages = complaint.complaint_images?.map((img: any) => img.url) || (complaint.image ? [complaint.image] : []);
        
        return {
          id: complaint.id,
          title: complaint.title,
          type: complaint.type,
          description: complaint.description,
          location: complaint.location,
          place: complaint.place,
          date: formatDateTime(complaint.created_at),
          status: complaint.status,
          image: imageUrl,
          images: allImages,
          completedImage: complaint.completion_image_url || null,
          completedAt: complaint.completed_at ? formatDateTime(complaint.completed_at) : null,
          completedNotes: complaint.completion_notes || null,
        };
      });

      setComplaints(formatted);
    } catch (err) {
      console.error('TasksScreen fetch error:', err);
      Alert.alert('Error', 'Something went wrong while loading complaints.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser, complaintsTab]);

  // Load complaints when tab changes
  useEffect(() => {
    if (currentUser) {
      fetchComplaints();
    }
  }, [complaintsTab, currentUser]);

  // Manual refresh handler
  const onRefresh = useCallback(() => {
    fetchComplaints(true);
  }, [fetchComplaints]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Complaints</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications' as any)} activeOpacity={0.7}>
          <BadgedBellIcon size={22} color={colors.text} badgeCount={unreadCount} />
        </TouchableOpacity>
      </View>

      <View style={styles.subTabContainer}>
        <TouchableOpacity
          style={[styles.subTab, complaintsTab === 'in-progress' && styles.activeSubTab]}
          onPress={() => setComplaintsTab('in-progress')}
          activeOpacity={0.8}
        >
          <ClockIcon size={16} color={complaintsTab === 'in-progress' ? colors.text : colors.textSecondary} />
          <Text style={[styles.subTabText, complaintsTab === 'in-progress' && styles.activeSubTabText]}>
            In Progress
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subTab, complaintsTab === 'completed' && styles.activeSubTab]}
          onPress={() => setComplaintsTab('completed')}
          activeOpacity={0.8}
        >
          <CheckCircleIcon size={16} color={complaintsTab === 'completed' ? colors.text : colors.textSecondary} />
          <Text style={[styles.subTabText, complaintsTab === 'completed' && styles.activeSubTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading complaints...</Text>
          </View>
        ) : complaints.length ? (
          complaints.map(complaint => (
            <TouchableOpacity
              key={complaint.id}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('UserComplaintDetail', { complaint })}
            >
              <Card>
                <View style={styles.complaintCard}>
                  <View style={styles.complaintHeader}>
                    <Text style={styles.complaintTitle}>{complaint.title}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: complaint.status === 'completed' ? colors.success : colors.accent },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {complaint.status === 'completed' ? 'Completed' : 'In Progress'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.complaintDetails}>
                    <View style={styles.detailRow}>
                      <MapPinIcon size={16} color={colors.textSecondary} />
                      <Text style={styles.detailText}>{complaint.location}{complaint.place ? ` • ${complaint.place}` : ''}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <CalendarIcon size={16} color={colors.textSecondary} />
                      <Text style={styles.detailText}>{complaint.date}</Text>
                    </View>
                  </View>

                  <Text style={styles.complaintDescription}>{complaint.description}</Text>

                  {complaint.image ? (
                    <Image 
                      source={{ uri: complaint.image }} 
                      style={styles.complaintImage}
                      resizeMode="cover"
                    />
                  ) : null}
                </View>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No {complaintsTab === 'in-progress' ? 'in-progress' : 'completed'} complaints yet.
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollViewContent: {
    paddingBottom: 120,
    gap: 16,
  },
  bottomSpacer: {
    height: 100,
  },
  subTabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  subTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeSubTab: {
    backgroundColor: colors.primary,
  },
  subTabText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activeSubTabText: {
    color: colors.text,
  },
  complaintCard: {
    gap: 16,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  complaintTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    lineHeight: 24,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.3,
  },
  complaintDetails: {
    gap: 10,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  complaintDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginTop: 4,
  },
  complaintImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: colors.surface,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: colors.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export { MyComplaints };
