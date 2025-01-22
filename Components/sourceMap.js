import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Image,
  TextInput,
  Alert,
SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';


const background = require('../assets/back.png');


const closeIcon = require('../assets/x.png');


const initialSpringsData = [
  {
    id: 1,
    title: 'Evian Source (France)',
    photo: require('../assets/1.jpg'),
    location: 'Evian-les-Bains region, near Lake Geneva, France.',
    description:
      'Evian water originates from a source fed by the melted glacial waters of the Alps. It is naturally filtered for 15 years through sandy layers, enriching it with minerals.',
    composition: 'Contains calcium (80 mg/L), magnesium (26 mg/L), sodium (6.5 mg/L), bicarbonates, and low nitrate levels.',
    specialFeatures:
      'Thanks to natural filtration, the water has a soft and balanced taste, making it ideal for daily consumption. The Evian source is located in an ecologically clean area.',
    interestingFacts: [
      'Evian water was first discovered in 1789 by Marquis de Lessert, who noticed its healing effects after drinking it.',
      'Today, Evian is one of the most recognizable bottled water brands globally and a symbol of premium consumption.',
      'The company actively supports environmental projects, including a plastic recycling program.',
    ],
  },
  {
    id: 2,
    title: 'San Pellegrino Source (Italy)',
    photo: require('../assets/2.jpg'),
    location: 'San Pellegrino Terme, Lombardy, Italy.',
    description:
      'San Pellegrino is a natural mineral water sourced from underground springs in the mountains of Lombardy. Its rich mineral content and natural carbonation make it popular among gourmets.',
    composition: 'Contains sodium (22.5 mg/L), calcium (31.0 mg/L), magnesium (5.7 mg/L), bicarbonates (205 mg/L).',
    specialFeatures:
      'Known for its natural carbonation and rich mineral composition, the water has a refreshing and tonic flavor. It pairs well with gourmet cuisine.',
    interestingFacts: [
      'San Pellegrino has been known since the 13th century, and the water was recognized for its health benefits.',
      'In 1932, the brand introduced San Pellegrino with lemon, one of the first sparkling lemonades in the world.',
      'San Pellegrino Terme became a popular spa town due to the healing properties of its mineral waters.',
    ],
  },
  {
    id: 3,
    title: 'Perrier Source (France)',
    photo: require('../assets/3.jpg'),
    location: 'Vergèze, Occitania, France.',
    description:
      'Perrier is naturally sparkling mineral water sourced from the Vergèze spring, known since Roman times. Due to high underground pressure, the water is naturally carbonated.',
    composition: 'Contains calcium (147 mg/L), magnesium (3.2 mg/L), sulfates (50.0 mg/L), sodium (9.0 mg/L).',
    specialFeatures:
      'Natural carbonation and high mineral content give the water a refreshing and distinctive taste, making it popular both on its own and in cocktails.',
    interestingFacts: [
      'The source was known during the Roman Empire. In 1898, Dr. Louis Perrier bought it and began bottling the water.',
      'Perrier became popular in the U.S. in the 1970s thanks to a marketing campaign targeting celebrities.',
      'Perrier supports environmental programs, including ocean cleanup projects.',
    ],
  },
  {
    id: 4,
    title: 'Borjomi Source (Georgia)',
    photo: require('../assets/4.jpg'),
    location: 'Borjomi, Georgia, Borjomi-Kharagauli National Park.',
    description:
      'Borjomi water comes from volcanic springs at a depth of 8-10 km. The water rises under high pressure and naturally heats up to 38-41°C.',
    composition: 'The water is rich in minerals such as bicarbonates (540 mg/L), sodium (96.0 mg/L), calcium (53.0 mg/L).',
    specialFeatures:'With its rich mineral composition, Borjomi is used for treating digestive disorders and as a wellness water.',
    interestingFacts: [
      'Borjomi was popular in Soviet times and was often used in sanatoriums.',
      'The water is actively exported to many countries, including Europe and Asia.',
      'The source is part of a national park that protects the unique natural landscapes and ecosystems of the region.',
    ],
  },
  {
    id: 5,
    title: 'Vichy Source (France)',
    photo: require('../assets/5.jpg'),
    location: 'Vichy, Central France.',
    description:
      'The Vichy spring is famous for its thermal waters, rich in minerals, and used for both drinking and in cosmetics and medical treatments.',
    composition: 'The water contains high sodium (360 mg/L), calcium (21 mg/L), magnesium (6 mg/L), and bicarbonates.',
    specialFeatures:
      'Vichy thermal waters have healing properties, making them popular in spa treatments and skincare.',
    interestingFacts: [
      'The thermal springs of Vichy were discovered by the Romans and have been used for treatment ever since.',
      'Vichy is also a popular cosmetics brand, which uses the thermal water in its products.',
      'Vichy waters are among the oldest therapeutic springs in Europe.',
    ],
  },
  {
    id: 6,
    title: 'Blue Spring Source (USA)',
    photo: require('../assets/6.jpg'),
    location: 'Blue Springs, Florida, USA.',
    description:
      'This is one of the largest and purest freshwater springs in Florida, providing water to regional rivers and maintaining a stable temperature year-round (around 23°C).',
    composition: 'The water has low mineral content and very high clarity.',
    specialFeatures:
      'The water is so clean that it is popular among divers and recreational visitors.',
    interestingFacts: [
      'The spring is home to manatees, which winter in the area.',
      'Water from Blue Spring is used to promote ecotourism and support biodiversity.',
    ],
  },
  {
    id: 7,
    title: 'Artesian Springs',
    photo: require('../assets/7.jpg'),
    location: 'Artesian wells are found in many countries, including France, Australia, and the USA.',
    description:
      'Artesian water rises to the surface under natural pressure without the need for pumps, as it is located in deep underground layers between impermeable rock strata.',
    composition:
      'Mineral content varies by location but often contains high levels of minerals due to long contact with underground rock.',
    specialFeatures:
      'The water is of high purity, as it is protected from surface water contamination, and has a distinct taste.',
    interestingFacts: [
      'Artesian waters can rise several meters due to underground pressure.',
      'The most famous artesian basin is the Great Artesian Basin in Australia, which provides water to vast regions of the continent.',
    ],
  },
  {
    id: 8,
    title: 'Mount Hakone, Kanagawa, Japan.',
    photo: require('../assets/8.jpg'),
    location: 'Mount Hakone, Kanagawa, Japan.',
    description:
      'This is an active volcanic zone known for its hot springs, sulfurous waters, and geothermal activity.',
    composition:
      'The water is rich in sulfur and other minerals, giving it a distinctive smell and therapeutic properties for the skin and joints.',
    specialFeatures:
      'The hot springs are popular among tourists for therapeutic baths and are famous for their black eggs boiled in sulfurous water.',
    interestingFacts: [
      'According to local legends, one boiled egg from Ōwakudani extends life by seven years.',
      'The site is a popular tourist destination due to its unique geological activity and scenic landscapes.',
    ],
  },
  {
    id: 9,
    title: 'Pamukkale Source (Turkey)',
    photo: require('../assets/9.jpg'),
    location: 'Pamukkale, Denizli Province, Turkey.',
    description:
      'This thermal spring is famous for its white terraces, formed by calcium deposits. The waters are heated to around 35°C and have healing properties.',
    composition:'The water is rich in calcium, carbonates, and sulfates, contributing to the formation of the famous terraces.',
    specialFeatures:
      'The unique natural formations attract tourists from all over the world. The waters are used to treat rheumatism and skin conditions.',
    interestingFacts: [
      'Pamukkale is a UNESCO World Heritage Site.',
      'It is believed that the waters of Pamukkale help rejuvenate the skin and joints.',
    ],
  },
];

const SourceMap = () => {
  const [springsData, setSpringsData] = useState(initialSpringsData);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Состояния для формы добавления нового источника
  const [newTitle, setNewTitle] = useState('');
  const [newPhoto, setNewPhoto] = useState(null);
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newComposition, setNewComposition] = useState('');
  const [newSpecialFeatures, setNewSpecialFeatures] = useState('');
  const [newInterestingFacts, setNewInterestingFacts] = useState('');

  // Открыть модалку
  const openSourceModal = (index) => {
    setCurrentIndex(index);
    setModalVisible(true);
  };

  // Закрыть модалку
  const closeModal = () => {
    setModalVisible(false);
  };

  // Предыдущий источник
  const goToPrevSource = () => {
    const newIndex = (currentIndex - 1 + springsData.length) % springsData.length;
    setCurrentIndex(newIndex);
  };

  // Следующий источник
  const goToNextSource = () => {
    const newIndex = (currentIndex + 1) % springsData.length;
    setCurrentIndex(newIndex);
  };

  const currentSource = springsData[currentIndex];

  // Функция для сохранения источников в AsyncStorage
  const saveSpringsData = async (data) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem('springsData', jsonValue);
    } catch (e) {
      console.log('Error saving springs data', e);
    }
  };

  // Загрузка источников из AsyncStorage при монтировании
  useEffect(() => {
    const loadSpringsData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('springsData');
        if (storedData) {
          setSpringsData(JSON.parse(storedData));
        }
      } catch (e) {
        console.log('Error loading springs data', e);
      }
    };
    loadSpringsData();
  }, []);

  // Функция для добавления нового источника
  const addNewSource = () => {
    if (
      !newTitle ||
      !newLocation || 
      !newDescription || 
      !newComposition ||
      !newSpecialFeatures || 
      !newInterestingFacts
    ) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const newSource = {
      id: springsData.length + 1,
      title: newTitle,
      photo: newPhoto || require('../assets/water.png'), // Используйте дефолтное изображение, если не выбрано
      location: newLocation,
      description: newDescription,
      composition: newComposition,
      specialFeatures: newSpecialFeatures,
      interestingFacts: newInterestingFacts.split('\n'), // Разделяем факты по строкам
    };

    const updatedSpringsData = [...springsData, newSource];
    setSpringsData(updatedSpringsData);
    saveSpringsData(updatedSpringsData);

    // Сброс полей формы
    setNewTitle('');
    setNewPhoto(null);
    setNewLocation('');
    setNewDescription('');
    setNewComposition('');
    setNewSpecialFeatures('');
    setNewInterestingFacts('');

    Alert.alert('Success', 'New source added!');
  };



  const pickImage = async () => {
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
        Alert.alert('Ошибка', 'Не удалось выбрать изображение.');
      } else if (response.assets && response.assets.length > 0) {
        const { uri } = response.assets[0];
        setNewPhoto({ uri }); 
      }
    });
  };
  
  return (
   
      <ImageBackground source={background} style={styles.mainBackground}>
         <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Natural Water Sources</Text>


        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setCurrentIndex(springsData.length); 
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>Add New Source</Text>
        </TouchableOpacity>


        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.cardContainer}>
            {springsData.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => openSourceModal(index)}
              >
      
                <Image source={item.photo} style={styles.cardPreview} />
                <Text style={styles.cardTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

      
        <Modal visible={modalVisible} transparent animationType="slide">
         
          <ImageBackground source={background} style={styles.modalBackground}>
            <ScrollView style={styles.modalContainer}>
            
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Image source={closeIcon} style={styles.closeIcon} />
              </TouchableOpacity>

         
              <View style={styles.modalContent}>
                {currentIndex < springsData.length ? (
                 
                  <>
                    <View style={styles.modalPhotoContainer}>
                      <Image source={currentSource.photo} style={styles.photoImage} />
                    </View>

                    <ScrollView style={styles.textScroll}>
                      <Text style={styles.sourceTitle}>{currentSource.title}</Text>

                      <View style={styles.infoBlock}>
                        <Text style={styles.label}>Location:</Text>
                        <Text style={styles.infoText}>{currentSource.location}</Text>
                      </View>

                      <View style={styles.infoBlock}>
                        <Text style={styles.label}>Description:</Text>
                        <Text style={styles.infoText}>{currentSource.description}</Text>
                      </View>

                      <View style={styles.infoBlock}>
                        <Text style={styles.label}>Composition:</Text>
                        <Text style={styles.infoText}>{currentSource.composition}</Text>
                      </View>

                      <View style={styles.infoBlock}>
                        <Text style={styles.label}>Special Features:</Text>
                        <Text style={styles.infoText}>{currentSource.specialFeatures}</Text>
                      </View>

                      <View style={styles.infoBlock}>
                        <Text style={styles.label}>Interesting Facts:</Text>
                        {currentSource.interestingFacts?.map((fact, idx) => (
                          <Text key={idx} style={styles.infoText}>
                            • {fact}
                          </Text>
                        ))}
                      </View>
                    </ScrollView>
                    <View style={styles.navArrows}>
                      <TouchableOpacity style={styles.arrowButton} onPress={goToPrevSource}>
                        <Text style={styles.arrowText}>{'<'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.arrowButton} onPress={goToNextSource}>
                        <Text style={styles.arrowText}>{'>'}</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                 
                  <>
                    <Text style={styles.sourceTitle}>Add New Source</Text>

                
                    <TextInput
                      style={styles.input}
                      placeholder="Title"
                      value={newTitle}
                      onChangeText={setNewTitle}
                    />
                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
  {newPhoto ? (
    <Image source={newPhoto} style={{ width: 100, height: 100, borderRadius: 8 }} />
  ) : (
    <Text style={styles.imagePickerText}>Pick Photo</Text>
  )}
</TouchableOpacity>
                    <TextInput
                      style={styles.input}
                      placeholder="Location"
                      value={newLocation}
                      onChangeText={setNewLocation}
                    />
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Description"
                      value={newDescription}
                      onChangeText={setNewDescription}
                      multiline
                      numberOfLines={4}
                    />
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Composition"
                      value={newComposition}
                      onChangeText={setNewComposition}
                      multiline
                      numberOfLines={2}
                    />
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Special Features"
                      value={newSpecialFeatures}
                      onChangeText={setNewSpecialFeatures}
                      multiline
                      numberOfLines={2}
                    />
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Interesting Facts (separated by new lines)"
                      value={newInterestingFacts}
                      onChangeText={setNewInterestingFacts}
                      multiline
                      numberOfLines={4}
                    />

                   
                    <TouchableOpacity style={styles.submitButton} onPress={addNewSource}>
                      <Text style={styles.submitButtonText}>Add Source</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </ScrollView>
          </ImageBackground>
        </Modal>
        </SafeAreaView>
      </ImageBackground>
    
  );
};

export default SourceMap;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  header: {
    fontSize: 25,
    textAlign: 'center',
    marginVertical: 30,
    fontWeight: '700',
    color: '#055a5c',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  addButton: {
    backgroundColor: '#72c7c5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: 'center',
    width: '50%',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#72c7c5', // бирюзовый фон
    borderRadius: 10,
    marginBottom: 15,
    paddingVertical: 10,
    alignItems: 'center',
    // Тень для карточки (iOS/Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardPreview: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardTitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    paddingHorizontal: 5,
    textShadowColor: '#333',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  // Модальное окно
  modalBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    marginTop: 40,
    padding: 16,
    
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeIcon: {
    width: 50,
    height: 50,
  },
  modalContent: {
    flex: 1,
    marginTop: 10,
  },
  modalPhotoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  photoImage: {
    width: 340,
    height: 240,
    resizeMode: 'cover',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#72c7c5',
  },
  textScroll: {
    flex: 1,
    marginVertical: 8,
  },
  sourceTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#055a5c',
    marginBottom: 14,
    textAlign: 'center',
  },
  infoBlock: {
    backgroundColor: 'rgba(114, 199, 197, 0.8)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#055a5c',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#055a5c',
    marginLeft: 5,
    lineHeight: 20,
    textAlign: 'justify',
  },
  navArrows: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom:10,
    paddingBottom: 15,
  },
  arrowButton: {
    backgroundColor: '#72c7c5',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
  },
  arrowText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  // Стиль для формы
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#72c7c5',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: '#72c7c5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#72c7c5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});