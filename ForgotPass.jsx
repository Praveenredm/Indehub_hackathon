import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal } from 'react-native';
import { auth } from './firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import LottieView from 'lottie-react-native';

export default function ForgotPass() {
  const [email, setEmail] = useState('');
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessModalVisible(true);
      setTimeout(() => {
        setSuccessModalVisible(false);
      }, 2000);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2C3E50' }}>
      <View style={{ width: '85%', backgroundColor: '#34495E', padding: 25, borderRadius: 20 }}>
        <Text style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#fff' }}>
          Forgot Password?
        </Text>
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#ccc"
          style={{
            backgroundColor: '#ECF0F1',
            borderRadius: 10,
            padding: 12,
            marginBottom: 15,
            fontSize: 16,
            color: '#2C3E50',
          }}
          onChangeText={setEmail}
          value={email}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#28A745',
            padding: 15,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
          }}
          onPress={handleReset}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
            Send Reset Email
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal transparent visible={successModalVisible} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
        >
          <View
            style={{
              width: 250,
              height: 250,
              backgroundColor: '#fff',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LottieView
              source={{
                uri: 'https://lottie.host/d99e0460-d513-451a-8b2d-8de41c50ca2a/UkjPUTmOq8.json',
              }}
              autoPlay
              loop={false}
              style={{ width: 200, height: 200 }}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginTop: 10 }}>
              Reset Link Sent!
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
