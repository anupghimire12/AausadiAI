import React, { useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from './Button';
import ImagePickerComponent from './ImagePickerComponent';
import Header from './Header';

const mock = {
  drug_name: 'Glivec 400mg Tablet Imatinib mesylate',
  is_drug_found: true,
  side_effects: [
    'Edema swelling',
    'Nausea',
    'Vomiting',
    'Muscle cramp',
    'Musculoskeletal bone muscle or joint pain',
    'Diarrhea',
    'Rash',
    'Fatigue',
    'Abdominal pain',
    'Bleeding',
    'Breathing problems',
    'Cough',
    'Weight gain',
    'Dry eye',
    'Dizziness',
    'Hemorrhage',
  ],
  uses: 'Treatment of Cancer',
};

const CameraComponent = ({ onClose }) => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [name, setName] = useState();
  const [uses, setUses] = useState(null);
  const [effects, setEffects] = useState(null);
  const [drugImage, setDrugImage] = useState(null);
  const [drugName, setDrugName] = useState(null);
  const [chemicalClass, setChemicalClass] = useState(null);
  const [habitForming, setHabitForming] = useState(null);
  const [therapeuticClass, setTherapeuticClass] = useState(null);
  const [actionClass, setActionClass] = useState(null);
  const [substitutes, setSubstitutes] = useState([]);

  // console.log(Camera.Constants.FlashMode.on);

  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    // if (cameraRef) {
    //   try {
    //     const data = await cameraRef.current.takePictureAsync();
    //     console.log(data);
    //     setImage(data.uri);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
    if (cameraRef) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setLoading(true);
        const formData = new FormData();
        formData.append('file', {
          uri: photo.uri,
          type: 'image/jpg',
          name: 'photo.jpg',
        });

        console.log("+++++++++++++++++++++++++++++++++++++++")
        console.log(process.env.SERVER_ADDRESS)
        const response = await fetch(`${process.env.SERVER_ADDRESS}/files`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const responseData = await response.json();
        setData(responseData);
        setUses(responseData.uses);
        setEffects(responseData.side_effects);
        setDrugImage(photo.uri);
        setDrugName(responseData.drug_name);
        setChemicalClass(responseData.chemical_class);
        setHabitForming(responseData.habit_forming);
        setTherapeuticClass(responseData.therapeutic_class);
        setActionClass(responseData.action_class);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const onSelectImage = (uri) => {
    if (uri) {
      postImage(uri);
    }
  };

  const postImage = async (uri) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: 'image/jpg',
        name: 'photo.jpg',
      });

      const response = await fetch(`${process.env.SERVER_ADDRESS}/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const responseData = await response.json();
      console.log('Response:', responseData);

      setData([responseData.uses, responseData.side_effects]);
      setUses(responseData.uses);
      setEffects(responseData.side_effects);
      setDrugImage(uri);
      setDrugName(responseData.drug_name);
      setChemicalClass(responseData.chemical_class);
      setHabitForming(responseData.habit_forming);
      setTherapeuticClass(responseData.therapeutic_class);
      setActionClass(responseData.action_class);
      setSubstitutes(responseData.substitutes || []);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // const aspectRatio = 16 / 9;
  const retakePicture = () => {};

  const toggleFlashMode = () => {
    if (flash === Camera.Constants.FlashMode.off) {
      setFlash(Camera.Constants.FlashMode.torch);
    } else {
      setFlash(Camera.Constants.FlashMode.off);
    }
  };
  // console.log(flash);
  const toggleCameraFace = () => {
    if (type === Camera.Constants.Type.back) {
      setType(Camera.Constants.Type.front);
    } else {
      setType(Camera.Constants.Type.back);
    }
  };

  const openDrugInfo = () => {
    if (drugName) {
      const url = `https://www.drugs.com/search.php?searchterm=${encodeURIComponent(drugName)}`;
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: '#FAFAFA' }}>
          <View style={styles.header__container}>
            <Header />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#FAFAFA' }}>
            <ActivityIndicator size="large" color={'#2563eb'} />
          </View>
        </View>
      ) : (
        <View style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: '#FAFAFA' }}>
          {data ? (
            <ScrollView style={{ backgroundColor: '#FAFAFA' }}>
              <View>
                <View style={styles.header__container}>
                  <Header />
                </View>
                {data.is_drug_found == false ? (
                  <View
                    style={{
                      marginLeft: 2,
                      justifyContent: 'center',
                      height: 220,
                      position: 'relative',
                      backgroundColor: '#FAFAFA',
                    }}
                  >
                    <Image
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: 8,
                        alignSelf: 'center',
                        backgroundColor: '#F5F7FF',
                      }}
                      source={{ uri: drugImage }}
                    />
                    <Text
                      style={{
                        fontSize: 26,
                        fontWeight: '600',
                        color: '#da4848',
                        alignSelf: 'center',
                        position: 'absolute',
                        bottom: 0,
                        backgroundColor: '#FAFAFA',
                      }}
                    >
                      No relevant information found
                    </Text>
                  </View>
                ) : (
                  // --- Attractive Result Section ---
                  <View style={styles.resultCard}>
                    <Text style={styles.resultDrugName}>{drugName}</Text>
                    {/* Uses */}
                    <View style={styles.resultSection}>
                      <Text style={styles.resultSectionTitle}>Uses</Text>
                      {Array.isArray(uses)
                        ? uses.map((use, idx) => (
                            <Text key={idx} style={styles.resultUsesText}>• {use}</Text>
                          ))
                        : <Text style={styles.resultUsesText}>{uses}</Text>
                      }
                    </View>
                    {/* Side Effects */}
                    <View style={styles.resultSection}>
                      <Text style={styles.resultSectionTitle}>Side Effects</Text>
                      <View style={styles.sideEffectsList}>
                        {effects?.map((effect, index) => (
                          <View key={index} style={styles.effectPill}>
                            <Text style={styles.effectPillText}>• {effect}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    {/* Substitutes */}
                    <View style={styles.resultSection}>
                      <Text style={styles.resultSectionTitle}>Substitutes</Text>
                      <View style={styles.resultUsesList}>
                        {substitutes.length > 0
                          ? substitutes.map((sub, idx) => (
                              <Text key={idx} style={styles.resultUsesText}>• {sub}</Text>
                            ))
                          : <Text style={styles.resultUsesText}>No substitutes listed</Text>
                        }
                      </View>
                    </View>
                    {/* Other Info */}
                    <View style={styles.resultSection}>
                      <Text style={styles.resultSectionTitle}>Chemical Class</Text>
                      <Text style={styles.resultInfoText}>{chemicalClass}</Text>
                    </View>
                    <View style={styles.resultSection}>
                      <Text style={styles.resultSectionTitle}>Habit Forming</Text>
                      <Text style={styles.resultInfoText}>{habitForming}</Text>
                    </View>
                    <View style={styles.resultSection}>
                      <Text style={styles.resultSectionTitle}>Therapeutic Class</Text>
                      <Text style={styles.resultInfoText}>{therapeuticClass}</Text>
                    </View>
                    <View style={styles.resultSection}>
                      <Text style={styles.resultSectionTitle}>Action Class</Text>
                      <Text style={styles.resultInfoText}>{actionClass}</Text>
                    </View>
                  </View>
                )}
                {/* Improved Retake Button */}
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={() => setData(null)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.retakeButtonIcon}>⟲</Text>
                </TouchableOpacity>
                {/* Return to Home Button */}
                <TouchableOpacity
                  style={styles.homeButton}
                  onPress={onClose}
                  activeOpacity={0.85}
                >
                  <Text style={styles.homeButtonText}>Return to Home</Text>
                </TouchableOpacity>
                {/* More Info Online Button */}
                <TouchableOpacity
                  style={{
                    marginTop: 16,
                    alignSelf: 'center',
                    backgroundColor: '#2563eb',
                    borderRadius: 12,
                    paddingVertical: 10,
                    paddingHorizontal: 24,
                  }}
                  onPress={openDrugInfo}
                  activeOpacity={0.85}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
                    More Info Online
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          ) : (
            <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
              <View style={styles.topSection}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity>
                    <Button
                      icon={'flash'}
                      color={
                        flash === Camera.Constants.FlashMode.torch
                          ? '#2563eb'
                          : '#272626'
                      }
                      onPress={toggleFlashMode}
                    ></Button>
                  </TouchableOpacity>
                </View>
                <View style={{ position: 'absolute', right: 10 }}>
                  <TouchableOpacity>
                    <Button
                      icon={'cross'}
                      color={'#2563eb'}
                      onPress={onClose}
                    ></Button>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.cameraContainer}>
                {!image ? (
                  <Camera
                    style={styles.camera}
                    type={type}
                    flashMode={flash}
                    ref={cameraRef}
                  >
                    <View></View>
                    <View style={styles.bottomSection}>
                      {image ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            borderWidth: 2,
                            width: Dimensions.get('window').width,
                            backgroundColor: '#F5F7FF',
                            marginBottom: 40,
                          }}
                        >
                          <Button
                            title={'Re-take'}
                            icon="retweet"
                            onPress={() => setImage(null)}
                          />
                          <Button title={'Save'} icon="check" />
                        </View>
                      ) : (
                        <View style={styles.imageOptions}>
                          <ImagePickerComponent
                            onSelectImage={onSelectImage}
                            loading={loading}
                          />
                          <Button
                            onPress={takePicture}
                            style={styles.cameraIcon}
                          />
                          <Button
                            icon={'cycle'}
                            onPress={toggleCameraFace}
                            color={'#2563eb'}
                          />
                        </View>
                      )}
                    </View>
                  </Camera>
                ) : (
                  <Image
                    source={{ uri: image }}
                    style={styles.camera}
                    onPress={retakePicture}
                  />
                )}
              </View>
            </View>
          )}
        </View>
      )}

      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
    </View>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  header__container: {
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2563eb', // Blue
  },
  camera: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 50,
    justifyContent: 'space-between',
  },
  topSection: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#2563eb',
  },
  bottomSection: {
    backgroundColor: '#fff',
    height: 100,
  },
  imageOptions: {
    flex: 1,
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2563eb', // Blue border
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 10,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  resultDrugName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222', // Black
    textAlign: 'center',
    marginBottom: 2,
  },
  resultSection: {
    marginTop: 10,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb', // Blue
    marginBottom: 4,
  },
  resultUsesList: {
    marginTop: 4,
    marginBottom: 8,
    paddingLeft: 8,
  },
  resultUsesText: {
    fontSize: 15,
    color: '#047857', // Green
    fontWeight: '600',
  },
  sideEffectsList: {
    marginTop: 4,
    marginBottom: 8,
    paddingLeft: 8,
  },
  effectPill: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
    margin: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    alignItems: 'flex-start',
  },
  effectPillText: {
    color: '#b91c1c', // Red
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 2,
  },
  retakeButton: {
    width: 48,
    height: 48,
    backgroundColor: '#2563eb', // Blue
    borderRadius: 24,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 16,
  },
  retakeButtonIcon: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  homeButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 32,
    minWidth: 160,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  disclaimer: {
    color: '#b91c1c', // Red for disclaimer
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
  resultInfoText: {
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
  },
});
