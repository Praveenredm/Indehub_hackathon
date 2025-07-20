import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase'; // Ensure db and auth are exported from firebase.js

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState(null);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    address: '',
    number: '',
    contact1Name: '',
    contact1Number: '',
    contact2Name: '',
    contact2Number: '',
    contact3Name: '',
    contact3Number: '',
  });
  const [loading, setLoading] = useState(false);

  const userId = auth.currentUser?.uid;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled && result.assets) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const fetchProfile = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const profileDoc = doc(db, 'users', userId);
      const docSnap = await getDoc(profileDoc);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data.profile);
        setProfileImage(data.profileImage || null);
      }
    } catch (error) {
      console.log('Error fetching profile:', error);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!userId) {
      Alert.alert("Error", "User not logged in.");
      return;
    }
    setLoading(true);
    try {
      const profileDoc = doc(db, 'users', userId);
      await setDoc(profileDoc, { profile, profileImage });
      Alert.alert('Profile Updated!');
    } catch (error) {
      console.log('Error updating profile:', error);
      Alert.alert('Error', 'Could not update profile.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#2C3E50' }} contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
      {loading && <ActivityIndicator size="large" color="#E74C3C" />}

      <TouchableOpacity onPress={pickImage} disabled={loading}>
        <Image
          source={profileImage ? { uri: profileImage } : { uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
          style={{ width: 150, height: 150, borderRadius: 75, marginBottom: 20 }}
        />
      </TouchableOpacity>

      {['name', 'age', 'address', 'number', 'contact1Name', 'contact1Number', 'contact2Name', 'contact2Number', 'contact3Name', 'contact3Number'].map((field, idx) => (
        <TextInput
          key={idx}
          placeholder={field.replace(/([A-Z])/g, ' $1').trim()}
          placeholderTextColor="#BDC3C7"
          value={profile[field]}
          onChangeText={(text) => setProfile({ ...profile, [field]: text })}
          style={{ backgroundColor: '#ECF0F1', borderRadius: 10, padding: 12, marginBottom: 15, width: '100%', color: '#2C3E50' }}
          keyboardType={field.toLowerCase().includes('number') ? 'phone-pad' : 'default'}
        />
      ))}

      <TouchableOpacity
        style={{ backgroundColor: '#E74C3C', padding: 15, borderRadius: 10, width: '100%' }}
        onPress={handleUpdate}
        disabled={loading}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
