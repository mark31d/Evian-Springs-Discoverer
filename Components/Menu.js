import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Image,
  Dimensions,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const background = require('../assets/back.png');
const defaultProfilePhoto = require('../assets/water.png');
const waterImage = require('../assets/h2o.png');

const { width } = Dimensions.get('window');

const Menu = ({ navigation }) => {
  const [userPhoto, setUserPhoto] = useState(null);

  useEffect(() => {
    const loadUserPhoto = async () => {
      const savedPhoto = await AsyncStorage.getItem('userPhoto');
      setUserPhoto(savedPhoto || null);
    };
    loadUserPhoto();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Фон (непрокручиваемый) */}
      <ImageBackground
        source={background}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Прокручиваемый контент */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContainer}>

          {/* Кнопка-аватарка для открытия логина */}
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('LoginPart', { fromProfileButton: true })}
          >
            <Image
              source={userPhoto ? { uri: userPhoto } : defaultProfilePhoto}
              style={styles.profileImage}
            />
          </TouchableOpacity>

          <Text style={styles.title}>Evilen Springs Discoverer</Text>

          {/* Картинка воды над кнопками */}
          <Image source={waterImage} style={styles.waterImage} />

          {/* Кнопки главного меню */}
          <View style={styles.menuBlock}>
            <TouchableOpacity
              style={[styles.button, styles.largeButton]}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.largeButton]}
              onPress={() => navigation.navigate('Results')}
            >
              <Text style={styles.buttonText}>Results</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.largeButton]}
              onPress={() => navigation.navigate('FolderScreen')}
            >
              <Text style={styles.buttonText}>Photo Album</Text>
            </TouchableOpacity>

            {/* Новая кнопка для карты */}
            <TouchableOpacity
              style={[styles.button, styles.largeButton]}
              onPress={() => navigation.navigate('MapScreen')}
            >
              <Text style={styles.buttonText}>Sources Map</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.largeButton]}
              onPress={() => navigation.navigate('About')}
            >
              <Text style={styles.buttonText}>About Us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  mainContainer: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
  },
  profileButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 70,
    height: 70,
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#72c7c5',
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    color: '#055a5c',
  },
  waterImage: {
    width: width * 0.6,
    height: width * 0.3,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  menuBlock: {
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#72c7c5', // цвет как в остальном меню
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
    width: '70%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  largeButton: {
    width: width * 0.8,
    padding: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
});
export default Menu;