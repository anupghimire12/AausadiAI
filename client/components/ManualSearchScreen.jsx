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
      const response = await fetch(`${process.env.SERVER_ADDRESS}/manual_search`, {
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
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', textAlign: 'center', marginBottom: 2 }}>
              {result.drug_name}
            </Text>
            {/* Uses */}
            <View style={{ marginTop: 10 }}>
              <Text style={styles.resultSectionTitle}>Uses</Text>
              {Array.isArray(result.Uses) && result.Uses.length > 0
                ? result.Uses.map((use, idx) => (
                    <Text key={idx} style={styles.resultUsesText}>• {use}</Text>
                  ))
                : <Text style={styles.resultUsesText}>No uses listed</Text>
              }
            </View>
            {/* Side Effects */}
            <View style={{ marginTop: 10 }}>
              <Text style={styles.resultSectionTitle}>Side Effects</Text>
              {Array.isArray(result.Side_effects) && result.Side_effects.length > 0
                ? result.Side_effects.map((effect, idx) => (
                    <Text key={idx} style={styles.effectPillText}>• {effect}</Text>
                  ))
                : <Text style={styles.effectPillText}>No side effects listed</Text>
              }
            </View>
            {/* Substitutes */}
            <View style={{ marginTop: 10 }}>
              <Text style={styles.resultSectionTitle}>Substitutes</Text>
              {Array.isArray(result.Substitutes) && result.Substitutes.length > 0
                ? result.Substitutes.map((sub, idx) => (
                    <Text key={idx} style={styles.resultUsesText}>• {sub}</Text>
                  ))
                : <Text style={styles.resultUsesText}>No substitutes listed</Text>
              }
            </View>
            {/* Other Info */}
            <View style={{ marginTop: 10 }}>
              <Text style={styles.resultSectionTitle}>Chemical Class</Text>
              <Text style={styles.resultInfoText}>{result["Chemical Class"]}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.resultSectionTitle}>Habit Forming</Text>
              <Text style={styles.resultInfoText}>{result["Habit Forming"]}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.resultSectionTitle}>Therapeutic Class</Text>
              <Text style={styles.resultInfoText}>{result["Therapeutic Class"]}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={styles.resultSectionTitle}>Action Class</Text>
              <Text style={styles.resultInfoText}>{result["Action Class"]}</Text>
            </View>
          </View>
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