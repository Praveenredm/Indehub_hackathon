import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';

export default function SOSScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const confirmationTimeout = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  const triggerEmergencyActions = async () => {
    setLoading(true);

    try {
      await axios.post('http://192.168.0.104:5000/send-alert', {
  to: '+91xxxxxxxxxx',
  message: 'This is an SOS alert from SheShield!',
  location: `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`,
});


      Alert.alert('Alert Sent', 'Emergency SMS, WhatsApp message, and call triggered.');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send alert.');
    } finally {
      setLoading(false);
    }
  };

  const handleSOSPress = () => {
    let confirmed = false;

    Alert.alert(
      'Confirm SOS',
      'Do you really want to trigger SOS?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            clearTimeout(confirmationTimeout.current);
            confirmed = false;
          },
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            clearTimeout(confirmationTimeout.current);
            confirmed = true;
            triggerEmergencyActions();
          },
        },
      ],
      { cancelable: false }
    );

    // Auto-confirm logic after 4 seconds if no action taken
    confirmationTimeout.current = setTimeout(() => {
      if (!confirmed) {
        triggerEmergencyActions();
      }
    }, 4000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#2C3E50', justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={handleSOSPress}
        disabled={loading}
        style={{
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: '#E74C3C',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" size="large" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 32, fontWeight: 'bold' }}>SOS</Text>
        )}
      </TouchableOpacity>

      <Text style={{ color: '#ECF0F1', fontSize: 16, marginBottom: 8 }}>
        {location
          ? `Location: ${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`
          : 'Fetching Location...'}
      </Text>

      <Text style={{ color: '#ECF0F1', fontSize: 16 }}>
        Emergency Contact: +91 xxxxxxxxxx
      </Text>
    </View>
  );
}
