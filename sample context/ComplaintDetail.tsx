import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Alert, Modal, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../styles/colors';
import { Card } from '../../components/common/Card';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MapPinIcon, CalendarIcon, ClockIcon, CheckCircleIcon, ArrowBackIcon } from '../../components/common/icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { getCurrentUser } from '../../config/supabaseClient';
import { markNotificationAsViewed } from '../../services/notificationTracking';

const { width } = Dimensions.get('window');

interface Complaint {
  id: string;
  title: string;
  type: string;
  status: 'completed' | 'in-progress';
  location: string;
  place: string;
  description: string;
  date: string;
  image?: string;
  completedImage?: string;
  completedAt?: string;
  completedNotes?: string;
}

type RootStackParamList = {
  UserComplaintDetail: { complaint: Complaint };
};

type UserComplaintDetailScreenRouteProp = RouteProp<RootStackParamList, 'UserComplaintDetail'>;
type UserComplaintDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserComplaintDetail'>;

interface UserComplaintDetailScreenProps {
  route: UserComplaintDetailScreenRouteProp;
  navigation: UserComplaintDetailScreenNavigationProp;
}

const ComplaintDetail: React.FC<UserComplaintDetailScreenProps> = ({ route, navigation }) => {
  const { complaint } = route.params;
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mark notification as read when user views the complaint detail
  useEffect(() => {
    const markAsRead = async () => {
      const { user } = await getCurrentUser();
      if (user && complaint.id) {
        await markNotificationAsViewed(user.id, complaint.id);
      }
    };
    markAsRead();
  }, [complaint.id]);

  // Debug: Check image URL
  React.useEffect(() => {
    console.log('Complaint image URL:', complaint.image);
    console.log('Full complaint data:', JSON.stringify(complaint, null, 2));
  }, [complaint]);

  const openImageViewer = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageViewer(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <ArrowBackIcon size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Complaint Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{complaint.title}</Text>
            <View style={[styles.statusBadge, { 
              backgroundColor: complaint.status === 'completed' ? colors.success : colors.accent 
            }]}>
              {complaint.status === 'completed' && (
                <CheckCircleIcon size={16} color="#fff" />
              )}
              {complaint.status === 'in-progress' && (
                <ClockIcon size={16} color="#fff" />
              )}
              <Text style={styles.statusText}>
                {complaint.status === 'completed' ? 'Completed' : 'In Progress'}
              </Text>
            </View>
          </View>

          <View style={styles.typeTag}>
            <Text style={styles.typeText}>{complaint.type}</Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MapPinIcon size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoText}>{complaint.location} - {complaint.place}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <CalendarIcon size={20} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Submitted Date</Text>
                <Text style={styles.infoText}>{complaint.date}</Text>
              </View>
            </View>

            {complaint.completedAt && (
              <View style={styles.infoRow}>
                <CheckCircleIcon size={20} color={colors.success} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Completed Date</Text>
                  <Text style={styles.infoText}>{complaint.completedAt}</Text>
                </View>
              </View>
            )}
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{complaint.description}</Text>
        </Card>

        {complaint.status === 'completed' && complaint.completedImage ? (
          <Card>
            <Text style={styles.sectionTitle}>Before & After Photos</Text>
            <Text style={styles.sectionSubtitle}>Your complaint has been resolved!</Text>
            
            <View style={styles.photosContainer}>
              {/* User's Original Photo */}
              {complaint.image && (
                <View style={styles.photoSection}>
                  <View style={styles.photoHeader}>
                    <Text style={styles.photoLabel}>📷 Before (Your Photo)</Text>
                  </View>
                  <TouchableOpacity onPress={() => openImageViewer(complaint.image!)} activeOpacity={0.9}>
                    <Image 
                      source={{ uri: complaint.image, cache: 'force-cache' }} 
                      style={styles.photoImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <Text style={styles.photoCaption}>Original complaint photo you submitted</Text>
                </View>
              )}

              {/* Technician's Completion Photo */}
              <View style={styles.photoSection}>
                <View style={styles.photoHeader}>
                  <Text style={styles.photoLabel}>✅ After (Completed Work)</Text>
                </View>
                <TouchableOpacity onPress={() => openImageViewer(complaint.completedImage!)} activeOpacity={0.9}>
                  <Image 
                    source={{ uri: complaint.completedImage, cache: 'force-cache' }} 
                    style={styles.photoImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <Text style={styles.photoCaption}>Work completion photo from technician</Text>
              </View>
            </View>
          </Card>
        ) : (
          complaint.image && (
            <Card>
              <Text style={styles.sectionTitle}>Complaint Photo</Text>
              <TouchableOpacity onPress={() => openImageViewer(complaint.image!)} activeOpacity={0.9}>
                <Image 
                  source={{ uri: complaint.image }} 
                  style={styles.complaintImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </Card>
          )
        )}

        {complaint.completedNotes && (
          <Card>
            <Text style={styles.sectionTitle}>Technician's Notes</Text>
            <View style={styles.notesBox}>
              <Text style={styles.completedNotes}>{complaint.completedNotes}</Text>
            </View>
          </Card>
        )}

        {complaint.status === 'in-progress' && (
          <Card>
            <View style={styles.inProgressBox}>
              <ClockIcon size={40} color={colors.accent} />
              <Text style={styles.inProgressTitle}>Work In Progress</Text>
              <Text style={styles.inProgressText}>
                Your complaint is being worked on by our technician team. 
                You'll be able to see the completion photos once the work is done.
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Full Screen Image Viewer */}
      <Modal visible={showImageViewer} transparent animationType="fade" onRequestClose={() => setShowImageViewer(false)}>
        <View style={styles.imageViewerOverlay}>
          <TouchableOpacity 
            style={styles.imageViewerClose} 
            onPress={() => setShowImageViewer(false)}
            activeOpacity={0.8}
          >
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <View style={styles.imageViewerContainer}>
            {selectedImage && (
              <Image 
                source={{ uri: selectedImage, cache: 'force-cache' }} 
                style={styles.imageViewerImage} 
                resizeMode="contain" 
              />
            )}
          </View>
          <Text style={styles.imageViewerHint}>Pinch to zoom • Tap X to close</Text>
        </View>
      </Modal>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    lineHeight: 26,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  typeTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 20,
  },
  typeText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    gap: 20,
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.success,
    marginBottom: 24,
    fontWeight: '500',
    marginTop: -4,
  },
  description: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    marginTop: 4,
  },
  photosContainer: {
    gap: 32,
    marginTop: 8,
  },
  photoSection: {
    marginBottom: 0,
  },
  photoHeader: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
  },
  photoLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.3,
  },
  photoImage: {
    width: '100%',
    height: width - 80,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
    marginBottom: 8,
  },
  photoCaption: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  complaintImage: {
    width: '100%',
    height: width - 80,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  singleImage: {
    width: '100%',
    height: width - 80,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  notesBox: {
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  completedNotes: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  inProgressBox: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.accent + '10',
    borderRadius: 12,
  },
  inProgressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  inProgressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  imageViewerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  imageViewerContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageViewerImage: {
    width: '100%',
    height: '100%',
  },
  imageViewerHint: {
    position: 'absolute',
    bottom: 40,
    color: '#fff',
    fontSize: 13,
    opacity: 0.7,
  },
});

export { ComplaintDetail };
