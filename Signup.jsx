import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, ImageBackground, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import LottieView from 'lottie-react-native';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccessModalVisible(true);
      setTimeout(() => {
        setSuccessModalVisible(false);
        navigation.navigate('Login');
      }, 2000);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorModalVisible(true);
        setTimeout(() => {
          setErrorModalVisible(false);
        }, 2500);
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1586281380349-632a5b07d2e3' }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      resizeMode="cover"
    >
      <View style={{ width: '85%', backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 20, borderRadius: 15 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Signup</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#888"
          style={{ borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 15, padding: 10 }}
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          style={{ borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 15, padding: 10 }}
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity
          style={{ backgroundColor: '#6BCB77', padding: 15, borderRadius: 10, marginBottom: 10 }}
          onPress={handleSignup}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: '#6BCB77', textAlign: 'center' }}>Back to Login</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal transparent visible={successModalVisible} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <View style={{ width: 250, height: 250, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
              source={{ uri: 'https://lottie.host/d99e0460-d513-451a-8b2d-8de41c50ca2a/UkjPUTmOq8.json' }}
              autoPlay
              loop={false}
              style={{ width: 200, height: 200 }}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginTop: 10 }}>Signup Successful!</Text>
          </View>
        </View>
      </Modal>

      {/* Email Already Used Modal */}
      <Modal transparent visible={errorModalVisible} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <View style={{ width: 250, height: 280, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
              source={{ uri: 'https://lottie.host/b72cc0e0-620b-461a-bfdb-98e3b4100070/2hD3cOVqw2.json' }}
              autoPlay
              loop={false}
              style={{ width: 200, height: 200 }}
            />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#E74C3C', marginTop: 10 }}>Email Already in Use</Text>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}
