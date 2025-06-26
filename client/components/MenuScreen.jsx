import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MenuScreen = ({ onNavigate, theme = 'light' }) => {
  const isDark = theme === 'dark';
  return (
    <View style={[
      styles.menuContainer,
      { backgroundColor: isDark ? '#18181b' : '#fff' }
    ]}>
      {/* Removed MediscanPlus Menu text */}
      <TouchableOpacity style={[styles.menuButton, { backgroundColor: isDark ? '#27272a' : '#2563eb' }]} onPress={() => onNavigate('scan')}>
        <Text style={[styles.menuButtonText, { color: isDark ? '#fff' : '#fff' }]}>Scan Medicine</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuButton, { backgroundColor: isDark ? '#27272a' : '#2563eb' }]} onPress={() => onNavigate('info')}>
        <Text style={[styles.menuButtonText, { color: isDark ? '#fff' : '#fff' }]}>App Info</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuButton, { backgroundColor: isDark ? '#27272a' : '#2563eb' }]} onPress={() => onNavigate('terms')}>
        <Text style={[styles.menuButtonText, { color: isDark ? '#fff' : '#fff' }]}>Understand Terms</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuButton, { backgroundColor: isDark ? '#27272a' : '#2563eb' }]} onPress={() => onNavigate('manual')}>
        <Text style={[styles.menuButtonText, { color: isDark ? '#fff' : '#fff' }]}>Manual Medicine Search</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuButton, { backgroundColor: isDark ? '#27272a' : '#2563eb' }]} onPress={() => onNavigate('internet')}>
        <Text style={[styles.menuButtonText, { color: isDark ? '#fff' : '#fff' }]}>Search Internet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    borderRadius: 12,
    marginVertical: 10,
    padding: 16,
    width: 280,
    alignItems: 'center',
  },
  menuButtonText: { fontSize: 18, textAlign: 'center', fontWeight: '600' },
});

export default MenuScreen;