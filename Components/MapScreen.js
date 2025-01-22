import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window');
const closeIcon = require('../assets/x.png');

// Массив с координатами и описанием источников
const sources = [
  {
    name: 'Evian Source (France)',
    description: 'Evian-les-Bains, near Lake Geneva',
    latitude: 46.4034,
    longitude: 6.5708,
  },
  {
    name: 'San Pellegrino Source (Italy)',
    description: 'San Pellegrino Terme, Lombardy',
    latitude: 45.8273,
    longitude: 9.6702,
  },
  {
    name: 'Perrier Source (France)',
    description: 'Vergèze, Occitania',
    latitude: 43.7333,
    longitude: 4.1833,
  },
  {
    name: 'Borjomi Source (Georgia)',
    description: 'Borjomi, Borjomi-Kharagauli National Park',
    latitude: 41.8400,
    longitude: 43.3800,
  },
  {
    name: 'Vichy Source (France)',
    description: 'Vichy, Central France',
    latitude: 46.1287,
    longitude: 3.4235,
  },
  {
    name: 'Blue Spring Source (USA)',
    description: 'Blue Springs, Florida, USA',
    latitude: 28.9487,
    longitude: -81.3301,
  },
  {
    name: 'Artesian Springs',
    description: 'Various locations worldwide',
    latitude: 44.0000,
    longitude: -90.0000,
  },
  {
    name: 'Ōwakudani Source (Japan)',
    description: 'Mount Hakone, Kanagawa',
    latitude: 35.2393,
    longitude: 139.0304,
  },
  {
    name: 'Pamukkale Source (Turkey)',
    description: 'Pamukkale, Denizli Province',
    latitude: 37.9180,
    longitude: 29.1240,
  },
];

// Задаём пределы зума
const minDelta = 0.02;   // Минимально допустимый zoom (сильное приближение)
const maxDelta = 120;   // Максимально допустимый zoom (сильное отдаление)

const MapScreen = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 40, // условный центр карты
    longitude: 10,
    latitudeDelta: 60,
    longitudeDelta: 120,
  });

  const zoomIn = () => {
    setRegion((prev) => {
      const nextLatDelta = Math.max(prev.latitudeDelta / 2, minDelta);
      const nextLonDelta = Math.max(prev.longitudeDelta / 2, minDelta);
      return {
        ...prev,
        latitudeDelta: nextLatDelta,
        longitudeDelta: nextLonDelta,
      };
    });
  };

  const zoomOut = () => {
    setRegion((prev) => {
      const nextLatDelta = Math.min(prev.latitudeDelta * 2, maxDelta);
      const nextLonDelta = Math.min(prev.longitudeDelta * 2, maxDelta);
      return {
        ...prev,
        latitudeDelta: nextLatDelta,
        longitudeDelta: nextLonDelta,
      };
    });
  };

  return (
    <ImageBackground
      source={require('../assets/back.png')}
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          
          {/* Кнопка закрытия (goBack) */}
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Image source={closeIcon} style={styles.closeIcon} />
          </TouchableOpacity>

          <Text style={styles.headerText}>Water Sources Map</Text>

          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
            showsUserLocation={true}
          >
            {sources.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                title={item.name}
                description={item.description}
              />
            ))}
          </MapView>{/* Блок кнопок + и - */}
          <View style={styles.zoomContainer}>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
              <Text style={styles.zoomButtonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
              <Text style={styles.zoomButtonText}>-</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: width * 0.05,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeIcon: {
    width: 50,
    height: 50,
  },
  headerText: {
    marginTop: height * 0.001,
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#72c7c5',
    textAlign: 'center',
    marginBottom: height * 0.02,
  },
  map: {
    width: width * 0.9,
    height: height * 0.65,
    alignSelf: 'center',
    borderRadius: 15,
  },
  zoomContainer: {
    position: 'absolute',
    bottom: height * 0.02,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.5,
    alignSelf: 'center',
  },
  zoomButton: {
    width: width * 0.17,
    height: width * 0.17,
    backgroundColor: '#72c7c5',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButtonText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});