import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, Alert, Modal, Image, TouchableOpacity, FlatList, ActivityIndicator, Platform, PermissionsAndroid, Keyboard, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { launchCamera, launchImageLibrary, ImagePickerResponse, Asset } from 'react-native-image-picker';
import { colors } from '../../styles/colors';
import { CustomButton } from '../../components/common/CustomButton';
import { Card } from '../../components/common/Card';
import QRScannerScreen from '../../components/features/QRScannerScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { 
  BellIcon, 
  BadgedBellIcon,
  CameraIcon, 
  UploadIcon, 
  CheckCircleIcon,
  ChevronDownIcon
} from '../../components/common/icons';
import { 
  getCurrentUser, 
  createComplaint, 
  uploadComplaintImage 
} from '../../config/supabaseClient';
import { getDepartmentFromFloor } from '../../utils/departmentMapping';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { requestNotificationPermission } from '../../services/notificationService';
import { useNotificationBadge } from '../../hooks/useNotificationBadge';
import { sendNotifications } from '../../services/notificationManager';

interface ComplaintForm {
  title: string;
  location: string;
  place: string;
  description: string;
  image: string | null;
  class: string;
  floor: string;
  department: string;
  type: string;
  customType: string;
}

interface ComplaintType {
  label: string;
  value: string;
  category: string;
  requiresCustomType?: boolean;
}

interface QRData {
  class?: string;
  floor?: string;
  department?: string;
  building?: string;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role?: string;
}

type RootStackParamList = {
  Tasks: undefined;
  UserDashboard: undefined;
};

type UserDashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserDashboard'>;

interface UserDashboardProps {
  navigation: UserDashboardNavigationProp;
}

export const ComplaintForm: React.FC<UserDashboardProps> = ({ navigation }) => {
  /* -------------------------------- State -------------------------------- */
  const [showTypeDropdown, setShowTypeDropdown] = useState<boolean>(false);
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showImageViewer, setShowImageViewer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
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

  const [complaintForm, setComplaintForm] = useState<ComplaintForm>({
    title: '',
    location: '',
    place: '',
    description: '',
    image: null,
    class: '',
    floor: '',
    department: '',
    type: '',
    customType: ''
  });

  /* -------------------------- Complaint Type List - Organized by Category ------------------------ */
  const complaintTypes: ComplaintType[] = [
    // ===== INFRASTRUCTURE (Civil Department) =====
    { label: 'Wall/Paint Damage', value: 'wall', category: 'Infrastructure' },
    { label: 'Ceiling Damage', value: 'ceiling', category: 'Infrastructure' },
    { label: 'Floor Damage', value: 'floor', category: 'Infrastructure' },
    { label: 'Window/Glass Repair', value: 'window', category: 'Infrastructure' },
    { label: 'Door Repair', value: 'door', category: 'Infrastructure' },
    { label: 'Furniture Repair', value: 'furniture', category: 'Infrastructure' },
    { label: 'Building Structure', value: 'structure', category: 'Infrastructure' },
    { label: 'Other Infrastructure', value: 'civil-other', category: 'Infrastructure', requiresCustomType: true },
    
    // ===== ELECTRICAL (Electrical Department) =====
    { label: 'Electrical Wiring', value: 'electrical', category: 'Electrical' },
    { label: 'Lighting Problem', value: 'lighting', category: 'Electrical' },
    { label: 'Power Outage', value: 'power', category: 'Electrical' },
    { label: 'Switch/Socket Issue', value: 'switch', category: 'Electrical' },
    { label: 'Fan Not Working', value: 'fan', category: 'Electrical' },
    { label: 'Electrical Safety', value: 'electrical-safety', category: 'Electrical' },
    { label: 'Other Electrical', value: 'electrical-other', category: 'Electrical', requiresCustomType: true },
    
    // ===== MECHANICAL (Mechanical Department) =====
    { label: 'Air Conditioning', value: 'ac', category: 'Mechanical' },
    { label: 'Heating System', value: 'heating', category: 'Mechanical' },
    { label: 'Plumbing/Water', value: 'plumbing', category: 'Mechanical' },
    { label: 'Drainage Problem', value: 'drainage', category: 'Mechanical' },
    { label: 'Ventilation', value: 'ventilation', category: 'Mechanical' },
    { label: 'Elevator/Lift', value: 'elevator', category: 'Mechanical' },
    { label: 'Other Mechanical', value: 'mechanical-other', category: 'Mechanical', requiresCustomType: true },
    
    // ===== IT/TECHNICAL (IT Department) =====
    { label: 'Computer/Desktop', value: 'computer', category: 'IT/Technical' },
    { label: 'Projector/Display', value: 'projector', category: 'IT/Technical' },
    { label: 'Internet/Network', value: 'network', category: 'IT/Technical' },
    { label: 'Lab Equipment', value: 'lab', category: 'IT/Technical' },
    { label: 'Software Issue', value: 'software', category: 'IT/Technical' },
    { label: 'Printer/Scanner', value: 'printer', category: 'IT/Technical' },
    { label: 'Teaching Equipment', value: 'teaching', category: 'IT/Technical' },
    { label: 'Other IT/Technical', value: 'it-other', category: 'IT/Technical', requiresCustomType: true },
    
    // ===== HOUSEKEEPING (Housekeeping Department) =====
    { label: 'Cleanliness', value: 'cleanliness', category: 'Housekeeping' },
    { label: 'Washroom/Toilet', value: 'washroom', category: 'Housekeeping' },
    { label: 'Garbage/Waste', value: 'garbage', category: 'Housekeeping' },
    { label: 'Pest Control', value: 'pest', category: 'Housekeeping' },
    { label: 'Garden/Lawn', value: 'garden', category: 'Housekeeping' },
    { label: 'General Maintenance', value: 'maintenance', category: 'Housekeeping' },
    { label: 'Other Housekeeping', value: 'housekeeping-other', category: 'Housekeeping', requiresCustomType: true },
    
    // ===== GENERAL OTHER =====
    { label: 'Security Issue', value: 'security', category: 'Other' },
    { label: 'Fire Safety', value: 'fire', category: 'Other' },
    { label: 'General Other', value: 'other', category: 'Other', requiresCustomType: true }
  ];

  /* ----------------------------- Initialize ---------------------------- */
  useEffect(() => {
    loadUserAndComplaints();
  }, []);

  const loadUserAndComplaints = async (): Promise<void> => {
    try {
      const { user, error } = await getCurrentUser();
      if (error) {
        Alert.alert('Error', 'Failed to load user data');
        return;
      }
      setCurrentUser(user as any);
      
      // Request notification permissions
      await requestNotificationPermission();
    } catch (err) {
      console.error('Error loading user:', err);
    }
  };

  /* ------------------------------- Handlers ------------------------------ */
  const handleSetField = useCallback((field: keyof ComplaintForm, value: string) => {
    setComplaintForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleQRScan = (): void => setShowQRScanner(true);

  const handleScanComplete = (qrData: QRData): void => {
    const upd = {
      class: qrData.class || '',
      floor: qrData.floor || '',
      department: qrData.department || '',
      location: `Building ${qrData.building || 'A'} - Floor ${qrData.floor || '1'}`,
      place: `${qrData.department || 'General'} - Room ${qrData.class || '101'}`
    };
    setComplaintForm(p => ({ ...p, ...upd }));
    Alert.alert('QR Scanned', `${upd.location}\n${upd.place}`);
    setShowQRScanner(false);
  };

  const requestCameraPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const takePhoto = async (): Promise<void> => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Camera permission is required to take photos');
        setShowPhotoOptions(false);
        return;
      }

      const result: ImagePickerResponse = await launchCamera({
        mediaType: 'photo',
        quality: 0.7,
        maxWidth: 1024,
        maxHeight: 1024,
        saveToPhotos: false,
        cameraType: 'back',
        includeBase64: false,
      });
      
      if (result.didCancel) {
        setShowPhotoOptions(false);
        return;
      }
      
      if (result.errorCode) {
        Alert.alert('Camera Error', result.errorMessage || 'Failed to open camera');
        setShowPhotoOptions(false);
        return;
      }
      
      if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
        handleSetField('image', result.assets[0].uri);
      }
      setShowPhotoOptions(false);
    } catch (e) { 
      console.error('Camera error:', e);
      Alert.alert('Error', 'Camera failed to open. Check permissions.'); 
      setShowPhotoOptions(false);
    }
  };

  const pickImage = async (): Promise<void> => {
    try {
      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
        includeBase64: false,
      });
      
      if (result.didCancel) {
        setShowPhotoOptions(false);
        return;
      }
      
      if (result.errorCode) {
        Alert.alert('Gallery Error', result.errorMessage || 'Failed to pick image');
        setShowPhotoOptions(false);
        return;
      }
      
      if (result.assets && result.assets.length > 0) {
        handleSetField('image', result.assets[0].uri || '');
      }
      setShowPhotoOptions(false);
    } catch (e) { 
      console.error('Image picker error:', e);
      Alert.alert('Error', 'Failed to pick image. Check permissions.'); 
      setShowPhotoOptions(false);
    }
  };

  const submitComplaint = async (): Promise<void> => {
    const { title, type, description, location, place, image, customType } = complaintForm;
    
    if (!title || !type || !description || !location || !place) {
      Alert.alert('Missing Fields', 'Fill Title, Type, Location, Place, Description');
      return;
    }

    if (!image) {
      Alert.alert('Missing Photo', 'Please add a photo of the issue');
      return;
    }

    // Check if "Other" type is selected and customType is required
    const selectedType = complaintTypes.find(t => t.value === type);
    if (selectedType?.requiresCustomType && !customType?.trim()) {
      Alert.alert('Missing Field', 'Please specify the problem type');
      return;
    }

    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to submit a complaint');
      return;
    }

    setLoading(true);
    try {
      // Get fresh auth user to ensure we have the correct ID
      const { user: authUser, error: authError } = await getCurrentUser();
      
      if (authError || !authUser) {
        Alert.alert('Error', 'You must be logged in to submit a complaint');
        setLoading(false);
        return;
      }

      // Create complaint in database with authenticated user's ID
      // If "Other" is selected, append custom type to title
      const finalTitle = selectedType?.requiresCustomType && customType 
        ? `${customType} - ${title}` 
        : title;

      // Determine department routing:
      // 1. If floor info from QR code exists, use floor-to-department mapping
      // 2. Otherwise, complaint routes based on complaint type (handled in backend)
      let routingDepartment = complaintForm.department || null;
      if (complaintForm.floor) {
        const floorBasedDept = getDepartmentFromFloor(complaintForm.floor);
        if (floorBasedDept) {
          routingDepartment = floorBasedDept;
        }
      }

      const complaintData = {
        user_id: authUser.id,
        title: finalTitle,
        type,
        description,
        location,
        place,
        department: routingDepartment,
        floor: complaintForm.floor || null,
        class: complaintForm.class || null,
        status: 'in-progress' as const,
      };

      const { data: newComplaint, error: complaintError } = await createComplaint(complaintData);

      if (complaintError) {
        console.error('Complaint creation error:', complaintError);
        throw complaintError;
      }

      // Send notifications to admin and technicians
      if (newComplaint && authUser) {
        await sendNotifications({
          type: 'complaint_created',
          complaintId: newComplaint.id,
          complaintTitle: title,
          complaintType: type, // Use actual complaint type (e.g., "computer", "electrical")
          triggeredBy: authUser.id,
        });
      }

      // Upload image if provided
      if (image && newComplaint) {
        try {
          const { data: imageData, error: imageError } = await uploadComplaintImage(newComplaint.id, image);
          if (imageError) {
            console.error('Image upload error:', imageError);
            Alert.alert('Warning', 'Complaint submitted but image upload failed.');
          }
        } catch (imageErr) {
          console.error('Image upload exception:', imageErr);
          Alert.alert('Warning', 'Complaint submitted but image upload failed.');
        }
      }

      // Show success and reset form
      setShowSuccess(true);
      setComplaintForm({ 
        title: '', 
        location: '', 
        place: '', 
        description: '', 
        image: null, 
        class: '', 
        floor: '', 
        department: '', 
        type: '',
        customType: '' 
      });

      setTimeout(() => {
        setShowSuccess(false);
        navigation.navigate('Tasks');
      }, 1200);

    } catch (err: any) {
      console.error('Error submitting complaint:', err);
      Alert.alert('Error', err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------- Dropdown ------------------------------- */
  const renderDropdownModal = (): React.ReactElement => (
    <Modal visible={showTypeDropdown} transparent animationType="fade" onRequestClose={() => setShowTypeDropdown(false)}>
      <TouchableOpacity activeOpacity={1} style={styles.ddOverlay} onPress={() => setShowTypeDropdown(false)}>
        <View style={styles.ddPanel}>
          <View style={styles.ddHeader}><Text style={styles.ddHeaderText}>Select Complaint Type</Text></View>
          <FlatList
            data={complaintTypes}
            keyExtractor={i => i.value}
            renderItem={({ item, index }) => {
              const prev = index > 0 ? complaintTypes[index - 1] : null;
              const showCat = !prev || prev.category !== item.category;
              return (
                <>
                  {showCat && <Text style={styles.ddCategory}>{item.category}</Text>}
                  <TouchableOpacity style={[styles.ddItem, complaintForm.type === item.value && styles.ddItemActive]} onPress={() => { handleSetField('type', item.value); setShowTypeDropdown(false); }}>
                    <Text style={[styles.ddItemText, complaintForm.type === item.value && styles.ddItemTextActive]}>{item.label}</Text>
                    {complaintForm.type === item.value && <Icon name="check" size={16} color={colors.primary} />}
                  </TouchableOpacity>
                </>
              );
            }}
            style={{ maxHeight: 320 }}
          />
          <TouchableOpacity style={styles.ddCloseBtn} onPress={() => setShowTypeDropdown(false)}>
            <Text style={styles.ddCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  /* ------------------------------- Main UI -------------------------------- */
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.surface} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Complaint Form</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications' as any)} activeOpacity={0.7}>
          <BadgedBellIcon size={22} color={colors.text} badgeCount={unreadCount} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scroll} 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
          <Card>
              <Text style={styles.sectionTitle}>Location *</Text>
              <CustomButton title="Scan QR Code" icon={CameraIcon} variant="outline" onPress={handleQRScan} />
              {(complaintForm.department || complaintForm.floor || complaintForm.class) && (
                <View style={styles.scannedBox}>
                  {complaintForm.department ? <Text style={styles.scannedLine}>Dept: {complaintForm.department}</Text> : null}
                  {complaintForm.floor ? <Text style={styles.scannedLine}>Floor: {complaintForm.floor}</Text> : null}
                  {complaintForm.class ? <Text style={styles.scannedLine}>Room: {complaintForm.class}</Text> : null}
                </View>
              )}
            </Card>

            <Card>
              <Text style={styles.sectionTitle}>Complaint Details</Text>
              <Field label="Title *">
                <TextInput 
                  style={styles.input} 
                  value={complaintForm.title} 
                  onChangeText={(text) => handleSetField('title', text)} 
                  placeholder="Short title" 
                  placeholderTextColor={colors.textSecondary}
                  returnKeyType="next"
                />
              </Field>

              <Field label="Complaint Type *">
                <TouchableOpacity style={[styles.dropdownSelector, complaintForm.type && styles.dropdownSelectorActive]} onPress={() => setShowTypeDropdown(true)}>
                  <Text style={[styles.dropdownText, !complaintForm.type && styles.placeholder]}>
                    {complaintForm.type ? complaintTypes.find(t => t.value === complaintForm.type)?.label : 'Select type'}
                  </Text>
                  <ChevronDownIcon size={20} color={complaintForm.type ? colors.primary : colors.textSecondary} />
                </TouchableOpacity>
              </Field>

              {/* Show custom type input if "Other" option is selected */}
              {complaintTypes.find(t => t.value === complaintForm.type)?.requiresCustomType && (
                <Field label="Specify Problem Type *">
                  <TextInput 
                    style={[styles.input, styles.customTypeInput]} 
                    value={complaintForm.customType} 
                    onChangeText={(text) => handleSetField('customType', text)} 
                    placeholder="e.g., Staircase handrail broken" 
                    placeholderTextColor={colors.textSecondary}
                    returnKeyType="next"
                    autoFocus={true}
                  />
                  <Text style={styles.helperText}>
                    💡 Enter a brief description of the problem type
                  </Text>
                </Field>
              )}

              <Field label="Location *">
                <TextInput 
                  style={styles.input} 
                  value={complaintForm.location} 
                  onChangeText={(text) => handleSetField('location', text)} 
                  placeholder="Building & Floor" 
                  placeholderTextColor={colors.textSecondary}
                  returnKeyType="next"
                />
              </Field>
              <Field label="Place *">
                <TextInput 
                  style={styles.input} 
                  value={complaintForm.place} 
                  onChangeText={(text) => handleSetField('place', text)} 
                  placeholder="Dept / Room" 
                  placeholderTextColor={colors.textSecondary}
                  returnKeyType="next"
                />
              </Field>
              <Field label="Description *">
                <TextInput 
                  style={[styles.input, styles.textArea]} 
                  value={complaintForm.description} 
                  onChangeText={(text) => handleSetField('description', text)} 
                  multiline 
                  numberOfLines={5} 
                  placeholder="Describe the issue" 
                  placeholderTextColor={colors.textSecondary}
                  textAlignVertical="top"
                />
              </Field>

              <Field label="Photo *">
                {complaintForm.image ? (
                  <View>
                    <TouchableOpacity onPress={() => setShowImageViewer(true)} activeOpacity={0.8}>
                      <Image source={{ uri: complaintForm.image }} style={styles.preview} resizeMode="contain" />
                      <View style={styles.previewHint}>
                        <Icon name="zoom-in" size={20} color={colors.primary} />
                        <Text style={styles.previewHintText}>Tap to view full size</Text>
                      </View>
                    </TouchableOpacity>
                    <CustomButton title="Change Photo" variant="outline" size="small" onPress={() => setShowPhotoOptions(true)} />
                  </View>
                ) : (
                  <CustomButton title="Add Photo" icon={UploadIcon} variant="outline" onPress={() => setShowPhotoOptions(true)} />
                )}
              </Field>

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.loadingText}>Submitting complaint...</Text>
                </View>
              ) : (
                <CustomButton title="Submit Complaint" icon={CheckCircleIcon} size="large" onPress={submitComplaint} />
              )}
            </Card>
        </ScrollView>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.centerOverlay}>
          <View style={styles.successBox}>
            <CheckCircleIcon size={56} color={colors.success} />
            <Text style={styles.successTitle}>Submitted!</Text>
            <Text style={styles.successMsg}>Complaint recorded.</Text>
          </View>
        </View>
      </Modal>

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
            <Image 
              source={{ uri: complaintForm.image || '' }} 
              style={styles.imageViewerImage} 
              resizeMode="contain" 
            />
          </View>
          <Text style={styles.imageViewerHint}>Pinch to zoom • Tap X to close</Text>
        </View>
      </Modal>

      {/* Photo Options */}
      <Modal visible={showPhotoOptions} transparent animationType="slide">
        <View style={styles.centerOverlay}>
          <View style={styles.photoSheet}>
            {/* Header */}
            <View style={styles.photoHeader}>
              <View style={styles.photoIconCircle}>
                <CameraIcon size={28} color={colors.primary} />
              </View>
              <Text style={styles.photoTitle}>Add Photo</Text>
              <Text style={styles.photoSubtitle}>Choose how to add your photo</Text>
            </View>

            {/* Options */}
            <View style={styles.photoOptions}>
              <TouchableOpacity style={styles.photoOption} onPress={takePhoto}>
                <View style={[styles.photoIconBg, { backgroundColor: colors.primaryTransparent }]}>
                  <CameraIcon size={24} color={colors.primary} />
                </View>
                <View style={styles.photoOptionText}>
                  <Text style={styles.photoOptionTitle}>Take Photo</Text>
                  <Text style={styles.photoOptionSubtitle}>Use camera to capture</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.photoOption} onPress={pickImage}>
                <View style={[styles.photoIconBg, { backgroundColor: 'rgba(52, 152, 219, 0.1)' }]}>
                  <UploadIcon size={24} color="#3498db" />
                </View>
                <View style={styles.photoOptionText}>
                  <Text style={styles.photoOptionTitle}>From Gallery</Text>
                  <Text style={styles.photoOptionSubtitle}>Choose existing photo</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity 
              style={styles.photoCancelBtn} 
              onPress={() => setShowPhotoOptions(false)}
            >
              <Text style={styles.photoCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* QR Scanner */}
      <Modal visible={showQRScanner} animationType="slide">
        <QRScannerScreen onScan={handleScanComplete} onClose={() => setShowQRScanner(false)} />
      </Modal>

      {renderDropdownModal()}
    </SafeAreaView>
  );
};

/* ----------------------------- Reusable Components ----------------------------- */
interface FieldProps {
  label: string;
  children: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, children }) => (
  <View style={styles.field}> 
    <Text style={styles.fieldLabel}>{label}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 120, gap: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 12 },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  input: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.border, fontSize: 15, color: colors.text },
  textArea: { height: 120, textAlignVertical: 'top' },
  dropdownSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14 },
  dropdownSelectorActive: { borderColor: colors.primary },
  dropdownText: { fontSize: 15, color: colors.text },
  placeholder: { color: colors.textSecondary },
  preview: { width: '100%', height: 200, borderRadius: 12, marginBottom: 8, marginTop: 4, backgroundColor: colors.background },
  previewHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    marginBottom: 8,
    gap: 6,
  },
  previewHintText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
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
  scannedBox: { marginTop: 12, backgroundColor: colors.primaryTransparent, padding: 12, borderRadius: 10 },
  scannedLine: { fontSize: 12, color: colors.text },
  centerOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.7)', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 20,
  },
  successBox: { backgroundColor: colors.surface, padding: 28, borderRadius: 22, alignItems: 'center', width: '75%' },
  successTitle: { fontSize: 20, fontWeight: '700', marginTop: 12, color: colors.text },
  successMsg: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  photoSheet: { 
    backgroundColor: colors.surface, 
    borderRadius: 20, 
    width: '90%', 
    maxWidth: 380,
    overflow: 'hidden',
  },
  photoHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  photoIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  photoTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: colors.text,
    marginBottom: 4,
  },
  photoSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  photoOptions: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.surface,
  },
  photoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: colors.background,
  },
  photoIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  photoOptionText: {
    flex: 1,
  },
  photoOptionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  photoOptionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  photoCancelBtn: {
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 20,
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  photoCancelText: { 
    color: colors.danger, 
    fontWeight: '700',
    fontSize: 15,
  },
  ddOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', padding: 24, justifyContent: 'center' },
  ddPanel: { backgroundColor: colors.surface, borderRadius: 16, paddingBottom: 8, overflow: 'hidden', maxHeight: '80%' },
  ddHeader: { padding: 14, backgroundColor: colors.primary },
  ddHeaderText: { color: '#fff', fontWeight: '600', fontSize: 16, textAlign: 'center' },
  ddCategory: { 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    marginTop: 8,
    fontSize: 13, 
    fontWeight: '700', 
    color: colors.primary,
    backgroundColor: colors.primaryTransparent,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  ddItem: { paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  ddItemActive: { backgroundColor: colors.primaryTransparent },
  ddItemText: { fontSize: 15, color: colors.text },
  ddItemTextActive: { color: colors.primary, fontWeight: '600' },
  ddCloseBtn: { padding: 14, alignItems: 'center' },
  ddCloseText: { fontSize: 15, fontWeight: '600', color: colors.primary },
  customTypeInput: {
    borderColor: colors.primary,
    borderWidth: 1.5,
    backgroundColor: colors.primaryTransparent,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 6,
    fontStyle: 'italic',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text,
  },
});
