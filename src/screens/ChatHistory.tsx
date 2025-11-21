import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface FilterOption {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  id: string;
}

const SearchFilterScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateMode, setDateMode] = useState<'date' | 'time'>('date');

  const filterOptions: FilterOption[] = [
    { icon: 'image-outline', label: '图片', id: 'image' },
    { icon: 'document-text-outline', label: '文件', id: 'file' },
    { icon: 'calendar-outline', label: '日期', id: 'date' },
  ];

  const handleFilterPress = (id: string) => {
    console.log('Filter pressed:', id);
    if (id === 'date') {
      setShowDatePicker(true);
      setDateMode('date');
    }
    // Add your filter logic here for other filters
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
      console.log('Selected date:', date);
      
      // If we just selected a date on iOS, show time picker next
      if (Platform.OS === 'ios' && dateMode === 'date') {
        setDateMode('time');
      }
    }
  };

  const handleDatePickerClose = () => {
    setShowDatePicker(false);
    setDateMode('date');
  };

  const handleDateConfirm = () => {
    console.log('Date confirmed:', selectedDate);
    setShowDatePicker(false);
    setDateMode('date');
    // Add your search logic with the selected date here
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={handleDatePickerClose}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleDatePickerClose}>
                  <Text style={styles.modalButton}>取消</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {dateMode === 'date' ? '选择日期' : '选择时间'}
                </Text>
                <TouchableOpacity onPress={handleDateConfirm}>
                  <Text style={[styles.modalButton, styles.confirmButton]}>确定</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedDate}
                mode={dateMode}
                display="spinner"
                onChange={handleDateChange}
                textColor="#1F2937"
              />
            </View>
          </View>
        </Modal>
      );
    }

    return (
      showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode={dateMode}
          display="default"
          onChange={handleDateChange}
        />
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FCD34D" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>查找聊天记录</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Filter Options */}
      <View style={styles.filterContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.filterButton}
            onPress={() => handleFilterPress(option.id)}
            activeOpacity={0.7}
          >
            <View style={styles.filterIconWrapper}>
              <Ionicons name={option.icon} size={28} color="#4B5563" />
            </View>
            <Text style={styles.filterLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Selected Date Display */}
      {selectedDate && (
        <View style={styles.selectedDateContainer}>
          <Text style={styles.selectedDateLabel}>已选日期：</Text>
          <Text style={styles.selectedDateText}>
            {selectedDate.toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      )}

      {/* Empty Space */}
      <View style={styles.emptySpace} />

      {/* Date Picker */}
      {renderDatePicker()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEF3C7',
  },
  header: {
    backgroundColor: '#FCD34D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1F2937',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 16,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  filterIconWrapper: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: '#374151',
  },
  selectedDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  selectedDateLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 8,
  },
  selectedDateText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  emptySpace: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  confirmButton: {
    color: '#3B82F6',
    fontWeight: '600',
  },
});

export default SearchFilterScreen;