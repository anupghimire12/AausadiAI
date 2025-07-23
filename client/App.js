// import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native';
import Header from './components/Header';
import CameraComponent from './components/CameraComponent';
import MenuScreen from './components/MenuScreen';
import TermsScreen from './components/TermsScreen';
import InfoScreen from './components/InfoScreen';
import ManualSearchScreen from './components/ManualSearchScreen';
import InternetSearchScreen from './components/InternetSearchScreen';

export default function App() {
  const [showCamera, setShowCamera] = useState(false);
  const [screen, setScreen] = useState('menu');

  useEffect(() => {
    const onBackPress = () => {
      if (showCamera) {
        setShowCamera(false);
        return true;
      }
      if (screen !== 'menu') {
        setScreen('menu');
        return true;
      }
      // On menu, confirm exit
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() },
        ]
      );
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [screen, showCamera]);

  const handleButtonClick = () => {
    setShowCamera(true);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
  };

  const sendPing = async () => {
    try {
      const response = await fetch(process.env.SERVER_ADDRESS + '/ping', {
        method: 'POST',
      });
      const data = await response.json();
      Alert.alert('Backend Response', data.msg);
      console.log('Backend response:', data);
    } catch (error) {
      Alert.alert('Error', 'Could not connect to backend');
      console.log('Ping error:', error);
    }
  };

  const handleNavigate = (to) => {
    if (to === 'scan') {
      setShowCamera(true);
    } else {
      setScreen(to);
    }
  };

  return (
    <View style={styles.app__container}>
      {!showCamera && (
        <View style={styles.header__container}>
          <Header />
        </View>
      )}
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          {!showCamera ? (
            screen === 'menu' ? (
              <MenuScreen onNavigate={handleNavigate} onPing={sendPing} />
            ) : screen === 'terms' ? (
              <TermsScreen onBack={() => setScreen('menu')} />
            ) : screen === 'info' ? (
              <InfoScreen onBack={() => setScreen('menu')} />
            ) : screen === 'manual' ? (
              <ManualSearchScreen onBack={() => setScreen('menu')} />
            ) : screen === 'internet' ? (
              <InternetSearchScreen onBack={() => setScreen('menu')} />
            ) : (
              // fallback: show menu
              <MenuScreen onNavigate={handleNavigate} onPing={sendPing} />
            )
          ) : (
            <CameraComponent onClose={handleCloseCamera} />
          )}
        </SafeAreaView>
      </View>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
    </View>
  );
}

const styles = StyleSheet.create({
  app__container: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header__container: {
    backgroundColor: '#FAFAFA',
    paddingBottom: 0,
    borderBottomWidth: 1.5, // Thicker border for emphasis
    borderBottomColor: '#2563eb', // Subtle blue accent
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.08)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
