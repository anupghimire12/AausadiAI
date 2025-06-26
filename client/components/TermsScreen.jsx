import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const terms = [
  { term: 'Therapeutic Class', desc: 'Group of medicines used for the same medical condition.' },
  { term: 'Action Class', desc: 'How the medicine works in the body.' },
  { term: 'Beta Blocker', desc: 'Medicine that blocks adrenaline effects, used for heart and blood pressure.' },
  // Add more terms as needed
];

const TermsScreen = ({ onBack }) => (
  <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
    <TouchableOpacity onPress={onBack}>
      <Text style={{ color: '#2563eb', fontWeight: 'bold', marginBottom: 20 }}>← Back to Menu</Text>
    </TouchableOpacity>
    {terms.map((item, idx) => (
      <View key={idx} style={{ marginBottom: 18 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222' }}>{item.term}</Text>
        <Text style={{ color: '#444', fontSize: 15 }}>{item.desc}</Text>
      </View>
    ))}
  </ScrollView>
);

export default TermsScreen;