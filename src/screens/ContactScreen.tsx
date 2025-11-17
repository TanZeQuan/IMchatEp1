import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Contact {
  id: number;
  name: string;
}

interface ContactsByLetter {
  [key: string]: Contact[];
}

const ContactsLayout: React.FC = () => {
  // Sample contacts grouped by first letter
  const contactsData: ContactsByLetter = {
    'A': [
      { id: 1, name: 'Anna' },
      { id: 2, name: 'Andrew' },
      { id: 3, name: 'Alice' }
    ],
    'B': [
      { id: 4, name: 'Bob' },
      { id: 5, name: 'Betty' }
    ],
    'C': [
      { id: 6, name: 'Charlie' },
      { id: 7, name: 'Carol' },
      { id: 8, name: 'Chris' }
    ],
    'D': [
      { id: 9, name: 'David' },
      { id: 10, name: 'Diana' }
    ],
    'E': [
      { id: 11, name: 'Edward' },
      { id: 12, name: 'Emily' }
    ],
    'J': [
      { id: 13, name: 'John' },
      { id: 14, name: 'Jane' }
    ],
    'M': [
      { id: 15, name: 'Michael' },
      { id: 16, name: 'Mary' },
      { id: 17, name: 'Mark' }
    ],
    'S': [
      { id: 18, name: 'Sarah' },
      { id: 19, name: 'Steve' }
    ]
  };

  const alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
  const sortedLetters = Object.keys(contactsData).sort();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>通讯录</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
          <TextInput
            placeholder="搜索"
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
        </View>
      </View>
  
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <Ionicons name="person-add" size={24} color="#666" />
          </View>
          <Text style={styles.actionLabel}>新的朋友</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <Ionicons name="people" size={24} color="#666" />
          </View>
          <Text style={styles.actionLabel}>仅人群聊</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <View style={styles.actionIcon}>
            <Ionicons name="chatbubbles" size={24} color="#666" />
          </View>
          <Text style={styles.actionLabel}>我的好友</Text>
        </TouchableOpacity>
      </View>
        
      {/* Contacts List */}
      <View style={styles.listContainer}>
        <ScrollView style={styles.scrollView}>
          {sortedLetters.map((letter) => (
            <View key={letter}>
              {/* Section Header */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{letter}</Text>
              </View>
              
              {/* Contacts under this letter */}
              {contactsData[letter].map((contact, index) => (
                <TouchableOpacity
                  key={contact.id}
                  style={[
                    styles.contactItem,
                    index % 2 === 0 ? styles.contactItemYellow : styles.contactItemWhite
                  ]}
                >
                  <View style={styles.avatar}>
                    <Ionicons name="person" size={20} color="#fff" />
                  </View>
                  <Text style={styles.contactName}>{contact.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* Alphabet Index */}
        <View style={styles.alphabetIndex}>
          {alphabet.map((letter) => (
            <TouchableOpacity key={letter} style={styles.alphabetItem}>
              <Text style={styles.alphabetText}>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    color: '#374151',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  actionButtons: {
    backgroundColor: '#FEF3C7',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 12,
    color: '#374151',
  },
  listContainer: {
    flex: 1,
    position: 'relative',
  },
  sectionHeader: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  sectionHeaderText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  contactItemYellow: {
    backgroundColor: '#fff',
  },
  contactItemWhite: {
    backgroundColor: '#fff',
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#9CA3AF',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactName: {
    fontSize: 16,
    color: '#374151',
  },
  alphabetIndex: {
    position: 'absolute',
    right: 4,
    top: '10%',
    alignItems: 'center',
  },
  alphabetItem: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  alphabetText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
});

export default ContactsLayout;