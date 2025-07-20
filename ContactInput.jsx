import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from './firebase';

const db = getFirestore(app);
const auth = getAuth(app);

export default function ContactInput() {
  const [contacts, setContacts] = useState([
    { name: '', number: '' },
    { name: '', number: '' },
    { name: '', number: '' },
  ]);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchContacts = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'contacts', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContacts(docSnap.data().contacts);
        }
      }
    };
    fetchContacts();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'contacts', user.uid), { contacts });
        setSuccessModalVisible(true);
        setTimeout(() => {
          setSuccessModalVisible(false);
          navigation.reset({ index: 0, routes: [{ name: 'MainScreen' }] });
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving contacts:', error);
      Alert.alert('Error', 'Failed to save contacts.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#2C3E50' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        keyboardShouldPersistTaps="handled"
      >
        <LottieView
          source={{ uri: 'https://lottie.host/4539ed73-ed51-42f6-bec1-c5685210c0f0/oghjRCqNVu.json' }}
          autoPlay
          loop
          style={{ width: '100%', height: 180, marginBottom: 20 }}
        />

        <Text style={{
          color: '#ECF0F1',
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 20,
        }}>
          Add Emergency Contacts
        </Text>

        {contacts.map((contact, index) => (
          <View key={index} style={{
            marginBottom: 15,
            backgroundColor: '#34495E',
            padding: 15,
            borderRadius: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}>
            <Text style={{ color: '#ECF0F1', marginBottom: 8, fontWeight: '600' }}>
              Contact {index + 1}
            </Text>
            <TextInput
              placeholder={`Name ${index + 1}`}
              placeholderTextColor="#BDC3C7"
              value={contact.name}
              onChangeText={(text) => handleInputChange(index, 'name', text)}
              style={{
                backgroundColor: '#ECF0F1',
                borderRadius: 8,
                padding: 12,
                marginBottom: 10,
                color: '#2C3E50',
              }}
            />
            <TextInput
              placeholder={`Number ${index + 1}`}
              placeholderTextColor="#BDC3C7"
              value={contact.number}
              onChangeText={(text) => handleInputChange(index, 'number', text)}
              keyboardType="phone-pad"
              style={{
                backgroundColor: '#ECF0F1',
                borderRadius: 8,
                padding: 12,
                color: '#2C3E50',
              }}
            />
          </View>
        ))}

        <TouchableOpacity
          style={{
            backgroundColor: '#E74C3C',
            padding: 18,
            borderRadius: 12,
            marginTop: 10,
          }}
          onPress={handleSave}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
            Save Contacts
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <Modal transparent visible={successModalVisible} animationType="fade">
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}>
          <View style={{
            width: 250,
            height: 250,
            backgroundColor: '#fff',
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <LottieView
              source={{ uri: 'https://lottie.host/d99e0460-d513-451a-8b2d-8de41c50ca2a/UkjPUTmOq8.json' }}
              autoPlay
              loop={false}
              style={{ width: 200, height: 200 }}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginTop: 10 }}>
              Contacts Saved!
            </Text>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
