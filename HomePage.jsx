// HomePage.jsx
import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import LottieView from 'lottie-react-native';

export default function HomePage() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1587395374730-1c907b14d0cc' }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      resizeMode="cover"
    >
      <View style={{ backgroundColor: 'rgba(255,255,255,0.8)', padding: 30, borderRadius: 20, alignItems: 'center', width: '85%' }}>
        <LottieView
          source={{ uri: 'https://lottie.host/c7cfcc9b-9889-4507-9de3-fc4722e34b98/BcYngXW1aA.json' }}
          autoPlay
          loop
          style={{ width: 250, height: 250 }}
        />
        <Text style={{ color: '#FF6B6B', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, fontFamily: 'sans-serif-medium' }}>
          SheShield
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: '#ff0000ff', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30 }}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
