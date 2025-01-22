// LoginPart.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
// Фон и дефолтная аватарка
const defaultProfilePhoto = require('../assets/water.png');
const background = require('../assets/back.png');

const LoginPart = ({ navigation, route }) => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);

  // Если перешли на этот экран с параметром { fromProfileButton: true }
  // — сразу показываем «логин-модалку»
  useEffect(() => {
    if (route.params?.fromProfileButton) {
      setLoginModalVisible(true);
    }
  }, [route.params]);

  // Загрузка данных из AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      const savedName = await AsyncStorage.getItem('userName');
      const savedPhoto = await AsyncStorage.getItem('userPhoto');
      if (savedName) setUserName(savedName);
      if (savedPhoto) setUserPhoto(savedPhoto);
    };
    loadUserData();
  }, []);

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const { uri } = response.assets[0];
        setUserPhoto(uri);
      }
    });
  };

 

  const handleResetData = () => {
    setUserName('');
    setUserPhoto(null);
  };

  const handleLogin = async () => {
    if (!userName.trim()) {
      alert('Please enter your username!');
      return;
    }
    await AsyncStorage.setItem('userName', userName);
    await AsyncStorage.setItem('userPhoto', userPhoto || '');

    // Закрываем «логин-модалку»
    setLoginModalVisible(false);

    
   navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
       
            state: {
              index: 0,
              routes: [{ name: 'Menu' }], 
            },
          },
        ],
      })
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Вся логика - внутри модалки */}
      <Modal visible={loginModalVisible} animationType="none" transparent>
        <ImageBackground source={background} style={styles.fullScreenBackground}>
          <View style={styles.fullScreenContainer}>
            <Text style={styles.loginTitle}>Profile</Text>
            <Text style={styles.addPhotoText}>Add Photo</Text>
            <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20 }}>
              <Image
                source={userPhoto ? { uri: userPhoto } : defaultProfilePhoto}
                style={styles.profileImage}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#888"
              value={userName}
              onChangeText={setUserName}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Add Name</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleResetData}>
              <Text style={styles.buttonText}>Reset Data</Text>
            </TouchableOpacity>
            
          </View>
        </ImageBackground>
      </Modal>
    </View>
  );
};

export default LoginPart;

const styles = StyleSheet.create({
  fullScreenBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#72c7c5',
    textAlign: 'center',
    marginBottom: 20,
  },
  addPhotoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#72c7c5',
    textAlign: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#72c7c5',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#72c7c5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '70%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});