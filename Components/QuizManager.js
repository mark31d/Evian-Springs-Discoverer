import AsyncStorage from '@react-native-async-storage/async-storage';

export const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // Количество миллисекунд в одном дне

export const DAILY_QUESTIONS = [
  {
    id: 1,
    question: "What proportion of the Earth's surface is covered by water?",
    answers: ['50%', '60%', '71%', '80%'],
    correctIndex: 2,
  },
  {
    id: 2,
    question: 'What is the percentage of water in the body of an adult?',
    answers: ['50-55%', '60-65%', '70-75%', '80-85%'],
    correctIndex: 1,
  },
];

// Функция для инициализации квиза
export const initializeQuiz = async () => {
  try {
    const savedLastPlayed = await AsyncStorage.getItem('lastPlayed');
    const savedQuestionIndex = await AsyncStorage.getItem('currentQuestionIndex');
    const now = Date.now();

    if (savedLastPlayed && now - parseInt(savedLastPlayed, 10) < ONE_DAY_IN_MS) {
      // Если прошло меньше суток, возвращаем текущий вопрос
      return {
        questionIndex: parseInt(savedQuestionIndex, 10) || 0,
        lastPlayed: parseInt(savedLastPlayed, 10),
      };
    } else {
      // Если прошло больше суток, переключаемся на следующий вопрос
      const nextQuestionIndex = (parseInt(savedQuestionIndex, 10) || 0) + 1;
      const updatedQuestionIndex = nextQuestionIndex % DAILY_QUESTIONS.length;

      await AsyncStorage.setItem('currentQuestionIndex', `${updatedQuestionIndex}`);
      await AsyncStorage.setItem('lastPlayed', `${now}`);

      return {
        questionIndex: updatedQuestionIndex,
        lastPlayed: now,
      };
    }
  } catch (error) {
    console.error('Error initializing quiz:', error);
    return {
      questionIndex: 0,
      lastPlayed: null,
    };
  }
};

// Функция для сохранения прогресса
export const saveQuizProgress = async (questionIndex) => {
  try {
    const now = Date.now();
    await AsyncStorage.setItem('lastPlayed', `${now}`);
    await AsyncStorage.setItem('currentQuestionIndex', `${questionIndex}`);
  } catch (error) {
    console.error('Error saving quiz progress:', error);
  }
};