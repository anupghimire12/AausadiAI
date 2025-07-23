import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';

export default function ManualSearchScreen({ onBack }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const searchMedicine = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('http://10.138.177.155:8000/manual-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setResult(data);
    } catch (e) {
      Alert.alert('Error', 'Could not fetch medicine info');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 12, paddingTop: 24 }}>
      <TouchableOpacity onPress={onBack}>
        <Text style={{ color: '#2563eb', fontWeight: 'bold', marginBottom: 20 }}>← Back to Menu</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Manual Medicine Search</Text>
      <TextInput
        placeholder="Enter medicine name"
        value={query}
        onChangeText={setQuery}
        style={{ borderWidth: 1, borderColor: '#2563eb', borderRadius: 8, padding: 10, marginBottom: 16 }}
      />
      <TouchableOpacity style={{ backgroundColor: '#2563eb', borderRadius: 8, padding: 12, marginBottom: 16 }} onPress={searchMedicine}>
        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Search</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#2563eb" />}
      {result && (
        <ScrollView contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}>
          <View style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: '#2563eb',
                width: '100%',
                marginTop: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
            }}>
            {/* Medicine Name */}
            {result.drug_name && (
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', textAlign: 'center', marginBottom: 2 }}>
                {result.drug_name}
              </Text>
            )}
            {/* Uses */}
            <View style={{ marginTop: 10 }}>
              <Text style={styles.resultSectionTitle}>Uses</Text>
              {Array.isArray(result.uses) && result.uses.length > 0
                ? result.uses.map((use, idx) => (
                    <Text key={idx} style={styles.resultUsesText}>• {use}</Text>
                  ))
                : <Text style={styles.resultUsesText}>No uses listed</Text>
              }
            </View>
            {/* Side Effects */}
            <View style={{ marginTop: 10 }}>
              <Text style={styles.resultSectionTitle}>Side Effects</Text>
              {Array.isArray(result.side_effects) && result.side_effects.length > 0
                ? result.side_effects.map((effect, idx) => (
                    <Text key={idx} style={styles.effectPillText}>• {effect}</Text>
                  ))
                : <Text style={styles.effectPillText}>No side effects listed</Text>
              }
            </View>
          </View>
          {/* Disclaimer */}
          <Text
            style={{
              color: '#e53935',
              fontSize: 15,
              textAlign: 'center',
              marginTop: 22,
              marginBottom: 6,
              fontWeight: '600',
              backgroundColor: '#fff5f5',
              borderRadius: 10,
              padding: 12,
              borderWidth: 1,
              borderColor: '#ffcdd2',
              letterSpacing: 0.1,
            }}
          >
            Disclaimer: This information is for basic reference only. It may not be complete or fully accurate. Always consult a qualified healthcare professional before taking any medication or making health decisions.
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = {
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 4
  },
  resultUsesText: {
    fontSize: 15,
    color: '#047857',
    fontWeight: '600'
  },
  effectPillText: {
    color: '#b91c1c',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 2
  },
  resultInfoText: {
    fontSize: 15,
    color: '#222',
    marginBottom: 4
  }
};