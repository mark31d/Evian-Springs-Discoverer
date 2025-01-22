import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  SafeAreaView, 
  ScrollView,
  Alert, // Импортируем Alert для диалогов подтверждения
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useAudio } from './AudioScript';
import { useVibration } from './Vibration';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Импортируем AsyncStorage

const SettingsScreen = ({ navigation }) => {
  const { isMusicPlaying, setIsMusicPlaying, volume, setVolume } = useAudio();
  const { vibrationOn, setVibrationOn } = useVibration();

  // Функция для сброса прогресса
  const resetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset your progress? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Reset",
          onPress: async () => {
            try {
              // Сбросить значение прогресса
              await AsyncStorage.setItem('waterDropFill', '0');
              // Сбросить флаг разблокировки эксперта
              await AsyncStorage.removeItem('expertUnlocked');
              
              Alert.alert("Success", "Your progress has been reset.");

              // Опционально: Обновить состояние компонентов, если необходимо
              // Например, если используется контекст или глобальное состояние
            } catch (error) {
              console.error("Error resetting progress:", error);
              Alert.alert("Error", "Failed to reset progress. Please try again.");
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <ImageBackground source={require('../assets/back.png')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Settings</Text>

          <View style={styles.setting}>
            <Text style={styles.settingText}>Music Volume: {Math.round(volume * 100)}%</Text>
            <Slider
              style={styles.slider}
              value={volume}
              onValueChange={setVolume}
              minimumValue={0}
              maximumValue={1}
              step={0.01}
              minimumTrackTintColor="#5DADE2"
              maximumTrackTintColor="#D6EAF8"
              thumbTintColor="#3498DB"
            />
            <TouchableOpacity
              onPress={() => setIsMusicPlaying(!isMusicPlaying)}
              style={[
                styles.toggleButton,
                isMusicPlaying && styles.toggleButtonActive
              ]}
            >
              <Text style={styles.toggleButtonText}>
                {isMusicPlaying ? 'Music OFF' : 'Music ON'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.setting}>
            <Text style={styles.settingText}>Vibration</Text>
            <TouchableOpacity
              onPress={() => setVibrationOn(!vibrationOn)}
              style={[
                styles.vibrationButton,
                vibrationOn && styles.vibrationButtonActive
              ]}
            >
              <Text style={styles.vibrationButtonText}>
                {vibrationOn ? 'Vibration OFF' : 'Vibration ON'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Кнопка сброса прогресса */}
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetProgress}
          >
            <Text style={styles.resetButtonText}>Reset Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.exitButtonText}>Return to Menu</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};const styles = StyleSheet.create({
  background: { 
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1B4F72',
    textAlign: 'center',
    marginBottom: 20,
  },
  setting: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignItems: 'center',
  },
  settingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#154360',
    marginBottom: 10,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  toggleButton: {
    marginTop: 10,
    backgroundColor: '#2980B9',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#1B4F72',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  vibrationButton: {
    marginTop: 10,
    backgroundColor: '#2980B9',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  vibrationButtonActive: {
    backgroundColor: '#1B4F72',
  },
  vibrationButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resetButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  exitButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  exitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#154360',
    textAlign: 'center',
  },
});

export default SettingsScreen;