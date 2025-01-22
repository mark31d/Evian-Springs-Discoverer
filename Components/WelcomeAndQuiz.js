import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

// Фон приложения
const background = require('../assets/back.png');

// 7 вопросов
const DAILY_QUESTIONS = [
  {
    id: 1,
    question: "1. What proportion of the Earth's surface is covered by water?",
    answers: ['50%', '60%', '71%', '80%'],
    correctIndex: 2, // c) 71%
  },
  {
    id: 2,
    question: '2. What is the percentage of water in the body of an adult?',
    answers: ['50-55%', '60-65%', '70-75%', '80-85%'],
    correctIndex: 1, // b) 60-65%
  },
  {
    id: 3,
    question:
      '3. How many liters of water is recommended for an adult to consume on average every day?',
    answers: ['1 liter', '2-3 liters', '5 liters', '4-5 liters'],
    correctIndex: 1, // b) 2-3 liters
  },
  {
    id: 4,
    question: "4. What percentage of the world's water reserves is fresh water?",
    answers: ['1%', '2.5%', '5%', '10%'],
    correctIndex: 1, // b) 2.5%
  },
  {
    id: 5,
    question: '5. How many liters of water are needed to produce one cup of coffee?',
    answers: ['50 liters', '100 liters', '140 liters', '200 liters'],
    correctIndex: 2, // c) 140 liters
  },
  {
    id: 6,
    question: '6. What is the name of the process during which water turns into steam?',
    answers: ['Boiling', 'Condensation', 'Evaporation', 'Sublimation'],
    correctIndex: 2, // c) Evaporation
  },
  {
    id: 7,
    question: '7. Which of the following seas does not have a coastline?',
    answers: ['Dead Sea', 'Sargasso Sea', 'Red Sea', 'Caspian Sea'],
    correctIndex: 1, // b) Sargasso Sea
  },
];

// сколько процентов добавлять за правильный ответ
const POINTS_PER_QUESTION = Math.floor(100 / DAILY_QUESTIONS.length);


const ONE_DAY_IN_MS = 24 * 60 * 60;

const WelcomeAndQuiz = ({ navigation }) => {
  // ------ СТЕЙТЫ ------
  const [welcomeModalVisible, setWelcomeModalVisible] = useState(true);
  const [dailyBonusModalVisible, setDailyBonusModalVisible] = useState(false);
  const [progressModalVisible, setProgressModalVisible] = useState(false);

  // Прогресс «капли воды»
  const [waterDropFill, setWaterDropFill] = useState(0);

  // Логика квиза
  const [answerSelected, setAnswerSelected] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  // «Последняя игра»
  const [lastPlayed, setLastPlayed] = useState(null);

  // Состояние для отслеживания, должен ли пользователь перейти на LoginPart
  const [shouldNavigateToLogin, setShouldNavigateToLogin] = useState(false);

  // ------ ЛОГИКА ПРИ ЗАПУСКЕ ------
  useEffect(() => {
    const initializeQuiz = async () => {
      const savedLastPlayed = await AsyncStorage.getItem('lastPlayed');
      const savedQuestionIndex = await AsyncStorage.getItem('currentQuestionIndex');
      const savedWaterDropFill = await AsyncStorage.getItem('waterDropFill');
      const now = Date.now();if (savedLastPlayed && now - parseInt(savedLastPlayed) < ONE_DAY_IN_MS) {
        // Минута не прошла => оставляем тот же вопрос
        setCurrentQuestionIndex(parseInt(savedQuestionIndex) ||  0);
      } else {
        // Минута прошла (или не играли)
        const nextQuestionIndex = (parseInt(savedQuestionIndex) || 0) + 1;
        const newIndex = nextQuestionIndex % DAILY_QUESTIONS.length;
        setCurrentQuestionIndex(newIndex);
        await AsyncStorage.setItem('currentQuestionIndex', `${newIndex}`);
        await AsyncStorage.setItem('lastPlayed', `${now}`);
      }
      setWaterDropFill(parseInt(savedWaterDropFill) || 0);
      setLastPlayed(savedLastPlayed ? parseInt(savedLastPlayed) : null);
    };
    initializeQuiz();
  }, []);

  // ------ ФУНКЦИИ ------
  const closeAllModals = () => {
    setWelcomeModalVisible(false);
    setDailyBonusModalVisible(false);
    setProgressModalVisible(false);
  };

  // Гость
  const handleContinueGuest = () => {
    closeAllModals();

    const now = Date.now();
    if (!lastPlayed || now - lastPlayed >= ONE_DAY_IN_MS) {
      // Минута прошла => показываем вопрос
      setDailyBonusModalVisible(true);
    } else {
      // Минута не прошла => сразу на экран прогресса (вместо Menu)
      setProgressModalVisible(true);
    }
  };

  // Логин
  const handleLogInWelcome = () => {
    closeAllModals();
    setShouldNavigateToLogin(true);

    const now = Date.now();
    if (!lastPlayed || now - lastPlayed >= ONE_DAY_IN_MS) {
      // Минута прошла => показываем вопрос
      setDailyBonusModalVisible(true);
    } else {
      // Минута не прошла => сразу на экран прогресса
      setProgressModalVisible(true);
    }
  };

  // Ответ на вопрос
  const handleAnswerQuestion = async () => {
    const now = Date.now();
    await AsyncStorage.setItem('lastPlayed', `${now}`);
    await AsyncStorage.setItem('currentQuestionIndex', `${currentQuestionIndex}`);

    const correctIndex = DAILY_QUESTIONS[currentQuestionIndex].correctIndex;
    if (answerSelected === correctIndex) {
      setIsAnswerCorrect(true);
      const newProgress = Math.min(waterDropFill + POINTS_PER_QUESTION, 100);
      setWaterDropFill(newProgress);
      await AsyncStorage.setItem('waterDropFill', `${newProgress}`);
    } else {
      setIsAnswerCorrect(false);
    }

    setDailyBonusModalVisible(false);
    setProgressModalVisible(true);
  };

  // Закрытие экрана прогресса
  const closeProgressModal = () => {
    closeAllModals();
    if (shouldNavigateToLogin) {
      setShouldNavigateToLogin(false);
      navigation.navigate('LoginPart', { fromProfileButton: true });
    } else {
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
    }
  };

  const handleUnlockExpertTopic = async () => {
    try {
      await AsyncStorage.setItem('expertUnlocked', 'true');
      alert('Expert Advice unlocked!');
    } catch (err) {
      console.log('Error setting expertUnlocked', err);
    }
  };// ------ ВЕРСТКА ------
  return (
    <View style={styles.container}>
      {/* Welcome Modal */}
      <Modal visible={welcomeModalVisible} animationType="none" transparent>
        <ImageBackground source={background} style={styles.fullScreenBackground}>
          <View style={styles.fullScreenContainer}>
            <Text style={styles.title}>Welcome!</Text>
            <Text style={styles.paragraph}>
              We’re excited to have you in our app! To get the best
              experience and save your progress, we invite you to register —
              it’s quick and easy. Registration unlocks all the features
              that will make using the app even more convenient.
              {'\n\n'}
              But don’t worry! You’re free to explore the app without
              registering. When you’re ready, you can create your account
              anytime. Your progress will be saved!
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleContinueGuest}>
              <Text style={styles.buttonText}>Continue as Guest</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#72c7c5' }]}
              onPress={handleLogInWelcome}
            >
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Modal>

      {/* Daily Bonus Modal */}
      <Modal visible={dailyBonusModalVisible} animationType="none" transparent>
        <ImageBackground source={background} style={styles.fullScreenBackground}>
          <View style={styles.fullScreenContainer}>
            <Text style={styles.title}>Daily Bonus</Text>
            <Text style={styles.subtitle}>
              {DAILY_QUESTIONS[currentQuestionIndex]?.question}
            </Text>
            {DAILY_QUESTIONS[currentQuestionIndex]?.answers.map((ans, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.answerOption,
                  answerSelected === index && { backgroundColor: '#c0f7db' },
                ]}
                onPress={() => setAnswerSelected(index)}
              >
                <Text>{ans}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: answerSelected !== null ? '#72c7c5' : '#ccc' },
              ]}
              onPress={handleAnswerQuestion}
              disabled={answerSelected === null}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Modal>

      {/* Progress Modal */}
      <Modal visible={progressModalVisible} animationType="none" transparent>
        <ImageBackground source={background} style={styles.fullScreenBackground}>
          <View style={styles.fullScreenContainer}>
            <Text style={styles.title}>Water Drop Progress</Text>
            <Text style={styles.subtitle}>
              Water drop is now {waterDropFill}% full!
            </Text>
            <TouchableOpacity style={styles.button} onPress={closeProgressModal}>
              <Text style={styles.buttonText}>
                {shouldNavigateToLogin ? 'Start' : 'Go to Menu'}
              </Text>
            </TouchableOpacity>
            {waterDropFill === 100 && (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#72c7c5' }]}
                onPress={handleUnlockExpertTopic}
              >
                <Text style={styles.buttonText}>Unlock Expert Advice</Text>
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      </Modal>
    </View>
  );
};

export default WelcomeAndQuiz;const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  title: {
    fontSize: 30,
    fontWeight: '600',
    color: '#007f7d',
    textAlign: 'center',
    marginBottom: 20,
  },
  paragraph: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#007f7d',
    textAlign: 'justify',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007f7d',
    marginBottom: 16,
    textAlign: 'center',
  },
  answerOption: {
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
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