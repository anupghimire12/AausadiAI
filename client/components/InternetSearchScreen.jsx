import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking } from 'react-native';
export default function InternetSearchScreen({ onBack }) {
  const [query, setQuery] = useState('');
  const searchInternet = () => {
    if (query) {
      const url = `https://www.drugs.com/search.php?searchterm=${encodeURIComponent(query)}&a=1`;
      Linking.openURL(url);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 24 }}>
      <TouchableOpacity onPress={onBack}>
        <Text style={{ color: '#2563eb', fontWeight: 'bold', marginBottom: 20 }}>← Back to Menu</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Search Internet</Text>
      <TextInput
        placeholder="Enter medicine name"
        value={query}
        onChangeText={setQuery}
        style={{ borderWidth: 1, borderColor: '#2563eb', borderRadius: 8, padding: 10, marginBottom: 16 }}
      />
      <TouchableOpacity style={{ backgroundColor: '#2563eb', borderRadius: 8, padding: 12 }} onPress={searchInternet}>
        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Search Medicine Information</Text>
      </TouchableOpacity>
    </View>
  );
}