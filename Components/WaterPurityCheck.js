import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Фон
const background = require('../assets/back.png');

// Иконки
const stopIcon = require('../assets/stop.png');  // Грязная вода
const checkIcon = require('../assets/check.png'); // Чистая вода
const warnIcon = require('../assets/warn.png');  // Сомнительная вода
const closeIcon = require('../assets/x.png');    // Крестик

const WaterPurityCheck = () => {
  // ------ Состояния для каждого параметра ------
  const [color, setColor] = useState('Clear');
  const [transparency, setTransparency] = useState('Clear');
  const [smell, setSmell] = useState('Odorless');
  const [taste, setTaste] = useState('Neutral');
  const [temperature, setTemperature] = useState(''); // пользователь вводит вручную
  const [particles, setParticles] = useState('No');

  // Состояния для модалки результата
  const [modalVisible, setModalVisible] = useState(false);
  const [resultTitle, setResultTitle] = useState('');
  const [resultDescription, setResultDescription] = useState('');
  const [resultIcon, setResultIcon] = useState(null);

  // ------ Логика определения чистоты воды ------
  const handleGenerate = () => {
    // 1) Считаем, сколько «опасных» значений у пользователя
    //    (по условию "Dirty water" требует минимум два совпадения)

    // Условия для «грязной воды» (dirty):
    // color: Dirty
    // transparency: Dirty
    // smell: Strong smell
    // taste: Unpleasant
    // particles: Yes
    // Если у нас 2+ таких значений, => Dirty water

    let dirtyParamsCount = 0;
    if (color === 'Dirty') dirtyParamsCount++;
    if (transparency === 'Dirty') dirtyParamsCount++;
    if (smell === 'Strong smell') dirtyParamsCount++;
    if (taste === 'Unpleasant') dirtyParamsCount++;
    if (particles === 'Yes') dirtyParamsCount++;

    // 2) Если у нас "dirtyParamsCount >= 2", то вода «грязная»
    if (dirtyParamsCount >= 2) {
      setResultTitle('Dirty water');
      setResultDescription('Do not use, cleaning is necessary, possible contamination.');
      setResultIcon(stopIcon);
      setModalVisible(true);
      return;
    }

    // 3) Иначе проверяем «чистая» ли вода:
    //    Полностью чистая, если:
    //    Color: Clear
    //    Transparency: Clear
    //    Smell: Odorless
    //    Taste: Neutral
    //    Presence of particles: No
    // (Температуру не учитываем напрямую, т.к. она не влияет на чистоту по условию)
    const isPure =
      color === 'Clear' &&
      transparency === 'Clear' &&
      smell === 'Odorless' &&
      taste === 'Neutral' &&
      particles === 'No';

    if (isPure) {
      setResultTitle('Pure water');
      setResultDescription('Can be used without purification.');
      setResultIcon(checkIcon);
      setModalVisible(true);
      return;
    }

    // 4) Если не «Dirty» и не «Pure», значит «Suspicious»
    setResultTitle('Questionable water');
    setResultDescription('It is recommended to purify it (e.g. by boiling or filtering).');
    setResultIcon(warnIcon);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ImageBackground source={background} style={styles.bg}>
    <SafeAreaView style={styles.container}>
      
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>Assessment of water purity</Text><View style={styles.pickerBlock}>
            <Text style={styles.label}>Water Color:</Text>
            <Picker
              selectedValue={color}
              onValueChange={(itemValue) => setColor(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Clear" value="Clear" />
              <Picker.Item label="Dirty" value="Dirty" />
              <Picker.Item label="Cloudy" value="Cloudy" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          {/* Transparency */}
          <View style={styles.pickerBlock}>
            <Text style={styles.label}>Transparency:</Text>
            <Picker
              selectedValue={transparency}
              onValueChange={(itemValue) => setTransparency(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Clear" value="Clear" />
              <Picker.Item label="Doubtful" value="Doubtful" />
              <Picker.Item label="Dirty" value="Dirty" />
            </Picker>
          </View>

          {/* Smell */}
          <View style={styles.pickerBlock}>
            <Text style={styles.label}>Smell:</Text>
            <Picker
              selectedValue={smell}
              onValueChange={(itemValue) => setSmell(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Odorless" value="Odorless" />
              <Picker.Item label="Slight smell" value="Slight smell" />
              <Picker.Item label="Strong smell" value="Strong smell" />
            </Picker>
          </View>

          {/* Taste */}
          <View style={styles.pickerBlock}>
            <Text style={styles.label}>Taste:</Text>
            <Picker
              selectedValue={taste}
              onValueChange={(itemValue) => setTaste(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Neutral" value="Neutral" />
              <Picker.Item label="Unpleasant" value="Unpleasant" />
            </Picker>
          </View>

          {/* Temperature (TextInput) */}
          <View style={styles.pickerBlock}>
            <Text style={styles.label}>Temperature (°C):</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter temperature"
              keyboardType="numeric"
              value={temperature}
              onChangeText={setTemperature}
            />
          </View>

          {/* Particles */}
          <View style={styles.pickerBlock}>
            <Text style={styles.label}>Presence of particles:</Text>
            <Picker
              selectedValue={particles}
              onValueChange={(itemValue) => setParticles(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="No" value="No" />
              <Picker.Item label="Yes" value="Yes" />
            </Picker>
          </View>

          {/* Кнопка Generate */}
          <TouchableOpacity style={styles.generateButton} onPress={handleGenerate}>
            <Text style={styles.generateText}>Generate</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Модалка результата */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Кнопка закрытия */}
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Image source={closeIcon} style={styles.closeIcon} />
              </TouchableOpacity>

              {/* Иконка результата */}
              <Image source={resultIcon} style={styles.resultIcon} />

              {/* Заголовок и описание */}
              <Text style={styles.resultTitle}>{resultTitle}</Text>
              <Text style={styles.resultDesc}>{resultDescription}</Text>
            </View>
          </View>
        </Modal>
        </SafeAreaView>
      </ImageBackground>
 
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#055a5c',
  },
  pickerBlock: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 10,
  },
  generateButton: {
    backgroundColor: '#72c7c5',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  generateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Модалка
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  closeIcon: {
    width: 40,
    height: 40,
    
  },
  resultIcon: {
    width: 70,
    height: 70,
    marginVertical: 10,
    resizeMode: 'contain',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#055a5c',
    textAlign: 'center',
  },
  resultDesc: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
});
export default WaterPurityCheck;