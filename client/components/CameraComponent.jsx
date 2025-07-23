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
  SafeAreaView,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Button from './Button';
import ImagePickerComponent from './ImagePickerComponent';
import Header from './Header';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
console.log("+++++++++++")
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
    <View style={styles.fullScreenContainer}>
      {(loading || data) && (
        <View style={styles.header__container}>
          <Header />
        </View>
      )}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#FAFAFA' }}>
          <ActivityIndicator size="large" color={'#2563eb'} />
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
          {data ? (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                  justifyContent: 'center',
                  paddingBottom: 32,
                  paddingTop: 8,
                }}
                showsVerticalScrollIndicator={true}
              >
                <View style={styles.resultCardFull}>
                  {/* Scanned Image */}
                  {drugImage && (
                    <>
                      <Image
                        source={{ uri: drugImage }}
                        style={styles.resultImageLarge}
                      />
                      {/* Medicine Name below image */}
                      {drugName && (
                        <Text style={styles.resultDrugName}>{drugName}</Text>
                      )}
                    </>
                  )}
                  {/* Uses */}
                  <View style={styles.resultSectionLeft}>
                    <Text style={styles.resultSectionTitleLeft}>Uses</Text>
                    {Array.isArray(uses)
                      ? uses.map((use, idx) => (
                          <Text key={idx} style={styles.resultUsesTextLeft}>• {use}</Text>
                        ))
                      : <Text style={styles.resultUsesTextLeft}>{uses}</Text>
                    }
                  </View>
                  {/* Side Effects */}
                  <View style={styles.resultSectionLeft}>
                    <Text style={styles.resultSectionTitleLeft}>Side Effects</Text>
                    <View style={styles.sideEffectsListLeft}>
                      {effects?.map((effect, index) => (
                        <View key={index} style={styles.effectPillLeft}>
                          <Text style={styles.effectPillTextLeft}>• {effect}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  {/* Disclaimer */}
                  <Text style={styles.disclaimerFull}>
                    Disclaimer: This information is for basic reference only. It may not be complete or fully accurate. Always consult a qualified healthcare professional before taking any medication or making health decisions.
                  </Text>
                </View>
                {/* More Info Online Button above footer, styled attractively */}
                <TouchableOpacity
                  style={styles.moreInfoButtonAttractive}
                  onPress={openDrugInfo}
                  activeOpacity={0.88}
                >
                  <MaterialCommunityIcons name="web" size={22} color="#2563eb" style={{ marginRight: 8 }} />
                  <Text style={styles.moreInfoButtonTextAttractive}>More Info Online</Text>
                </TouchableOpacity>
                {/* Footer with Retake Icon and Return to Home */}
                <View style={styles.footerFull}>
                  <TouchableOpacity
                    style={styles.footerButtonLeftIcon}
                    onPress={() => setData(null)}
                    activeOpacity={0.85}
                  >
                    <MaterialCommunityIcons name="camera-retake" size={32} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.footerButtonRightFull}
                    onPress={onClose}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.footerButtonTextFull}>Return to Home</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </SafeAreaView>
          ) : (
            <View style={{ backgroundColor: '#FAFAFA', flex: 1 }}>
              {/* NO HEADER HERE while taking image */}
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
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
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
    borderColor: '#2563eb',
    alignItems: 'center',
  },
  resultCardFull: {
    backgroundColor: '#fff',
    borderRadius: 18,
    margin: 10,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#2563eb',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  resultImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2563eb',
    alignSelf: 'center',
  },
  resultImageLarge: {
    width: 160,
    height: 160,
    borderRadius: 16,
    backgroundColor: '#e0f2fe',
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: '#2563eb',
    alignSelf: 'center',
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
  resultSectionLeft: {
    marginTop: 10,
    alignSelf: 'flex-start',
    width: '100%',
    paddingLeft: 10,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb', // Blue
    marginBottom: 4,
  },
  resultSectionTitleLeft: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
    marginBottom: 4,
    textAlign: 'left',
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
  resultUsesTextLeft: {
    fontSize: 15,
    color: '#047857',
    fontWeight: '600',
    textAlign: 'left',
  },
  sideEffectsList: {
    marginTop: 4,
    marginBottom: 8,
    paddingLeft: 8,
  },
  sideEffectsListLeft: {
    marginTop: 4,
    marginBottom: 8,
    paddingLeft: 8,
    alignItems: 'flex-start',
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
  effectPillLeft: {
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
  effectPillTextLeft: {
    color: '#b91c1c',
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
    color: '#b91c1c',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 4,
    fontWeight: '700',
    backgroundColor: '#fffbe6',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  disclaimerFull: {
    color: '#e53935', // Normal red
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
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginBottom: 24,
    marginTop: 8,
  },
  footerFull: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 32,
    marginBottom: 32,
    marginTop: 12,
    alignItems: 'center',
  },
  footerButtonLeft: {
    backgroundColor: '#2563eb',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 120,
    alignItems: 'center',
  },
  footerButtonLeftIcon: {
    backgroundColor: '#2563eb',
    borderRadius: 28,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    elevation: 2,
  },
  footerButtonRight: {
    backgroundColor: '#2563eb',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 120,
    alignItems: 'center',
  },
  footerButtonRightFull: {
    backgroundColor: '#2563eb',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 140,
    alignItems: 'center',
    elevation: 2,
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  footerButtonTextFull: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  moreInfoButton: {
    backgroundColor: '#fff',
    borderColor: '#2563eb',
    borderWidth: 1.5,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginHorizontal: 40,
    marginBottom: 24,
    alignItems: 'center',
    elevation: 2,
  },
  moreInfoButtonAttractive: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#e0f2fe',
    borderColor: '#2563eb',
    borderWidth: 2,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginHorizontal: 40,
    marginBottom: 12,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  moreInfoButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  moreInfoButtonTextAttractive: {
    color: '#2563eb',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
});
