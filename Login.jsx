import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LottieView from 'lottie-react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccessModalVisible(true);
      setTimeout(() => {
        setSuccessModalVisible(false);
        navigation.reset({ index: 0, routes: [{ name: 'ContactInput' }] });
      }, 2000);
    } catch {
      setErrorModalVisible(true);
      setTimeout(() => {
        setErrorModalVisible(false);
      }, 2500);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2C3E50' }}>
      <View style={{ width: '85%', backgroundColor: '#34495E', padding: 25, borderRadius: 20, alignItems: 'center' }}>
        <LottieView
          source={{ uri: 'https://lottie.host/281b7452-3810-434d-89ad-f8656a626e3c/UXuMy6M5TD.json' }}
          autoPlay
          loop
          style={{ width: 200, height: 200, marginBottom: 20 }}
        />
        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#ECF0F1' }}>Login</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#BDC3C7"
          style={{
            backgroundColor: '#ECF0F1',
            borderRadius: 10,
            padding: 12,
            marginBottom: 15,
            width: '100%',
            color: '#2C3E50'
          }}
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#BDC3C7"
          secureTextEntry
          style={{
            backgroundColor: '#ECF0F1',
            borderRadius: 10,
            padding: 12,
            marginBottom: 15,
            width: '100%',
            color: '#2C3E50'
          }}
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity
          style={{ backgroundColor: '#E74C3C', padding: 15, borderRadius: 10, marginBottom: 10, width: '100%' }}
          onPress={handleLogin}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={{ color: '#ECF0F1', textAlign: 'center', marginBottom: 10 }}>Go to Signup</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')}>
          <Text style={{ color: '#BDC3C7', textAlign: 'center' }}>Forgot Password?</Text>
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
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginTop: 10 }}>Login Successful!</Text>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal transparent visible={errorModalVisible} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <View style={{ width: 250, height: 280, backgroundColor: '#fff', borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
              source={{ uri: 'https://lottie.host/b72cc0e0-620b-461a-bfdb-98e3b4100070/2hD3cOVqw2.json' }}
              autoPlay
              loop={false}
              style={{ width: 200, height: 200 }}
            />
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#E74C3C', marginTop: 10 }}>Incorrect Email or Password</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
