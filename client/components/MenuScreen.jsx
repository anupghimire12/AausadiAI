import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MenuScreen = ({ onNavigate, onPing, theme = 'light' }) => {
  const isDark = theme === 'dark';
  return (
    <View style={[
      styles.menuContainer,
      { backgroundColor: isDark ? '#18181b' : '#fff' }
    ]}>
      {/* Small Ping button in top right */}
      <TouchableOpacity style={styles.pingButton} onPress={onPing}>
        <Text style={styles.pingButtonText}>Ping</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.menuButton, { backgroundColor: isDark ? '#27272a' : '#2563eb' }]} onPress={() => onNavigate('scan')}>
        <Text style={[styles.menuButtonText, { color: isDark ? '#fff' : '#fff' }]}>Scan Medicine</Text>
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
  pingButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    paddingVertical: 5,
    paddingHorizontal: 16,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    zIndex: 10,
    elevation: 2,
  },
  pingButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
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