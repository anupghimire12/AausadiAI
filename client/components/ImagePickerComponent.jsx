import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Entypo } from '@expo/vector-icons';

const ImagePickerComponent = ({ onSelectImage, loading }) => {
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        onSelectImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <TouchableOpacity
      onPress={pickImage}
      disabled={loading}
      style={[
        styles.button,
        loading && styles.disabledButton,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#2563eb" />
      ) : (
        <Entypo name="image" size={32} color="#2563eb" />
      )}
    </TouchableOpacity>
  );
};

export default ImagePickerComponent;

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 50,
    borderRadius: 14,
    backgroundColor: '#F5F7FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E3E8F0',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
