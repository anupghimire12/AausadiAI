// CameraComponent.js
import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import axios from 'axios';

const CameraComponent = () => {
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePhoto({
        quality: 0.5,
        base64: true,
      });
      setCapturedImage(photo.base64);
    }
  };

  const uploadImage = async () => {
    try {
      if (capturedImage) {
        // Replace with your backend endpoint
        const response = await axios.post('YOUR_BACKEND_API_ENDPOINT', {
          image: capturedImage,
        });
        console.log('Image uploaded successfully:', response.data);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device="back"
        isActive={true}
        photo={true}
      />
      {capturedImage ? (
        <View style={styles.overlay}>
          <Text style={styles.text}>Image Captured!</Text>
          <TouchableOpacity style={styles.button} onPress={uploadImage}>
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.buttonCapture} onPress={takePicture}>
          <Text style={styles.buttonText}>Capture Photo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    color: '#222',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonCapture: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 36,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default CameraComponent;
