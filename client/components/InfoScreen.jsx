import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
export default function InfoScreen({ onBack }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 24 }}>
      <TouchableOpacity onPress={onBack}>
        <Text style={{ color: '#2563eb', fontWeight: 'bold', marginBottom: 20 }}>← Back to Menu</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>App Info</Text>
      <Text>This app helps you scan and understand medicines using your camera.</Text>
    </View>
  );
}