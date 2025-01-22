import React, { useState, useEffect, useRef , useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Vibration,
  ImageBackground,
  Dimensions,
  Image,
  SafeAreaView,
  
} from 'react-native';
import Draggable from 'react-native-draggable';
import { UserContext } from './UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Импорт вопросов
import hardQuestions from '../Components/hardQuestions';
import easyQuestions from '../Components/easyQuestions';
const TEN_SECONDS = 24 * 60 * 60;
const QuizApp = () => {
    
    const [isShopVisible, setIsShopVisible] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [lives, setLives] = useState(3);
  const [hints, setHints] = useState(3);
  const { balance, addBalance, subtractBalance} = useContext(UserContext); 
  const [gameOver, setGameOver] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([]);

const [dailyBonus, setDailyBonus] = useState(null); // Состояние для хранения бонуса
const [showBonusModal, setShowBonusModal] = useState(false); // Состояние для отображения модального окна

const getRandomBonus = () => {
  const bonuses = ['Life', 'Hint', 'Coins'];
  const randomBonus = bonuses[Math.floor(Math.random() * bonuses.length)];
  setDailyBonus(randomBonus);
  setShowBonusModal(true);
};
  const selectedQuestions =
    difficulty === 'Difficult'
      ? hardQuestions.questions.flatMap((topic) => topic.questions)
      : easyQuestions.questions.flatMap((topic) => topic.questions);

  const [positions, setPositions] = useState([]);
  const initialPositionsRef = useRef([]);

  const dropZoneRef = useRef(null);
  const [dropZoneLayout, setDropZoneLayout] = useState(null);

  useEffect(() => {
    if (difficulty === 'Difficult') {
      const newAnswers = selectedQuestions[currentQuestion]?.options || [];
      setAnswers(newAnswers);

      // Инициализируем позиции для каждого ответа
      const hexagonRadius = 100;
      const centerX = Dimensions.get('window').width / 2 - 55; // Центр по ширине экрана
      const centerY = 100; // Примерное вертикальное положение
      const newPositions = newAnswers.map((_, index) => {
        const angle = (index * 2 * Math.PI) / newAnswers.length - Math.PI / 2;
        return {
          x: centerX + hexagonRadius * Math.cos(angle) - 30, // Отрегулируйте смещение по X при необходимости
          y: centerY + hexagonRadius * Math.sin(angle) - 30, // Отрегулируйте смещение по Y при необходимости
        };
      });
      setPositions(newPositions);
      initialPositionsRef.current = newPositions; // Сохраняем исходные позиции
    }
  }, [difficulty, currentQuestion]);

  const handleDragRelease = (index, moveX, moveY) => {
    console.log(`Drag release at index ${index}: moveX=${moveX}, moveY=${moveY}`);
    if (!positions[index]|| !dropZoneLayout) return;

    const { pageX: dzX, pageY: dzY, width: dzWidth, height: dzHeight } = dropZoneLayout;

    console.log(`Drop zone layout: x=${dzX}, y=${dzY}, width=${dzWidth}, height=${dzHeight}`);

    // Центр перетаскиваемого элемента
    const draggedElementCenterX = moveX;
    const draggedElementCenterY = moveY;

    console.log(`Dragged element center: x=${draggedElementCenterX}, y=${draggedElementCenterY}`);

    if (
      draggedElementCenterX >= dzX &&
      draggedElementCenterX <= dzX + dzWidth &&
      draggedElementCenterY >= dzY &&
      draggedElementCenterY <= dzY + dzHeight
    ) {
      console.log('Dropped inside the drop zone');
      // Элемент отпущен в зоне "Check Answers"
      const selected = answers[index];
      if (selectedAnswer === '') { // Позволяем выбрать только один ответ
        setSelectedAnswer(selected);
        // Можно удалить ответ из списка доступных, если необходимо
        // setAnswers((prevAnswers) => prevAnswers.filter((a, i) => i !== index));
      } else {
        Alert.alert('Attention', 'You have already chosen an answer. Check it first.');
      }
    } else {
      console.log('Dropped outside the drop zone');
    }

    // Возвращаем элемент на исходную позицию благодаря shouldReverse={true}
  };
  
  const handleCheckAnswer = () => {
    if (selectedAnswer === '') {
      Alert.alert('Please select an answer before checking.');
      return;
    }
    const currentQ = selectedQuestions[currentQuestion];
    if (selectedAnswer === currentQ.correct) {
        addBalance(100);
      Alert.alert('Correct!', 'You have earned 100 coins!');
    } else {
      setLives((prevLives) => {
        if (prevLives - 1 <= 0) {
          setGameOver(true);
        }
        return prevLives - 1;
      });
      Vibration.vibrate(500);
    }

    if (currentQuestion + 1 < selectedQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      setCompleted(true);
    }
  };
  const handleBuyHints = () => {
    if (balance >= 200) {
        subtractBalance(200);

      setHints(hints + 1);
      Alert.alert('Success', 'You have purchased a hint!');
      setIsShopVisible(false);
    } else {
      Alert.alert('Insufficient Funds', 'You do not have enough coins to buy a hint.');
    }
  };
  
  const handleBuyLives = () => {
    if (balance >= 200) {
        subtractBalance(200);

      setLives(lives + 1);
      Alert.alert('Success', 'You have purchased a life!');
      setIsShopVisible(false);
    } else {
      Alert.alert('Insufficient Funds', 'You do not have enough coins to buy a life.');
    }
  };
  const handleAnswerSelection = (answer) => {
    const currentQ = selectedQuestions[currentQuestion];

    if (answer === currentQ.correct) {
      addBalance(100);
      Alert.alert('Correct!', 'You have earned 100 coins!');
    } else {
        setLives(lives - 1);
      Vibration.vibrate(500);
      if (lives <= 0) {
        setGameOver(true);
      }
    }

    if (currentQuestion + 1 < selectedQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      setCompleted(true);
    }
  };

  const useHint = () => {
    if (hints <= 0) {
      Alert.alert('No hints left');
      return;
    }

    const currentQ = selectedQuestions[currentQuestion];

    if (difficulty === 'Easy') {
      // Автоматически выбрать правильный ответ и перейти к следующему вопросу
      Alert.alert('Hint Used', 'Correct answer selected automatically.');
      handleAnswerSelection(currentQ.correct);
    } else if (difficulty === 'Difficult') {
      // Удалить один неправильный ответ
      const incorrectAnswers = answers.filter(a => a !== currentQ.correct);
      if (incorrectAnswers.length === 0) {
        Alert.alert('No incorrect answers to remove');
        return;
      }
      const answerToRemove = incorrectAnswers[Math.floor(Math.random() * incorrectAnswers.length)];
      setAnswers(prevAnswers => prevAnswers.filter(a => a !== answerToRemove));
      Alert.alert('Hint Used', 'One incorrect answer has been removed.');
    }

    setHints(prevHints => prevHints - 1);
  };
  const applyBonus = () => {
    if (dailyBonus === 'Life') {
      setLives(lives + 1); // Добавить дополнительную жизнь
    } else if (dailyBonus === 'Hint') {
      setHints(hints + 1); // Добавить подсказку
    } else if (dailyBonus === 'Coins') {
      addBalance(100); // Добавить 100 монет
    }
  
    setShowBonusModal(false); // Закрыть модальное окно
  };
  const checkBonusAvailability = async () => {
    try {
      const storedTime = await AsyncStorage.getItem('lastBonusTime');
      const now = Date.now(); // Текущее время в миллисекундах

      if (!storedTime) {
        // Если еще ничего не сохраняли, сразу показываем бонус
        getRandomBonus();
        setShowBonusModal(true);
        await AsyncStorage.setItem('lastBonusTime', now.toString());
      } else {
        const prevBonusTime = parseInt(storedTime, 10);
        // Проверяем, прошло ли 10 секунд
        if (now - prevBonusTime >= TEN_SECONDS) {
          getRandomBonus();
        setShowBonusModal(true);
          await AsyncStorage.setItem('lastBonusTime', now.toString());
        } else {
         
        }
      }
    } catch (error) {
      console.error('Error checking bonus availability:', error);
    }
  };
  const handleDifficultySelection = (level) => {
    // Установить уровень сложности
    setDifficulty(level);
    checkBonusAvailability(); // Проверить, доступен ли бонус
  };

  useEffect(() => {
    checkBonusAvailability(); // Проверка бонуса при загрузке компонента
  }, []);
  const restartGame = () => {
    setDifficulty(null);
    setCurrentQuestion(0);
    setLives(3);
    setHints(3);
    setGameOver(false);
    setCompleted(false);
    setSelectedAnswer('');
    setAnswers([]);
    setPositions([]);
  };

  const onDropZoneLayout = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.measure((fx, fy, width, height, px, py) => {
        console.log('Drop zone measured:', { fx, fy, width, height, px, py });
        setDropZoneLayout({
          pageX: px,
          pageY: py,
          width: width,
          height: height,
        });
      });
    }
  };return (
   
      <ImageBackground source={require('../assets/back.png')} style={styles.background}>
         <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {!difficulty && (
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome to our quiz!</Text>
              <TouchableOpacity style={styles.levelButton} onPress={() => handleDifficultySelection('Easy')}>
              <Text style={styles.levelText}>Easy level</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.levelButton} onPress={() => handleDifficultySelection('Difficult')}>
              <Text style={styles.levelText}>Difficult level</Text>
              </TouchableOpacity>
            </View>
          )}
          {difficulty && !gameOver && !completed && (
            <View style={styles.quizContainer}>
              {/* Header с кнопкой "Back" */}
              <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => setDifficulty(null)}>
                  <Image source={require('../assets/x.png')} style={styles.backIcon} />
                </TouchableOpacity>
              </View>

              {/* Верхняя панель с подсказками, балансом и жизнями */}
              <View style={styles.topBar}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => useHint()}>
                  <Image source={require('../assets/hint-icon.png')} style={styles.icon} />
                  {hints > 0 && (
                    <View style={styles.iconBadge}>
                      <Text style={styles.badgeText}>{hints}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <View style={styles.balanceContainer}>
                  <Image source={require('../assets/coin.png')} style={styles.icon} />
                  <Text style={styles.balanceText}>{balance}</Text>
                </View>
                <View style={styles.iconContainer}>
                  <Image source={require('../assets/heart-icon.png')} style={styles.icon} />
                  {lives > 0 && (
                    <View style={styles.iconBadge}>
                      <Text style={styles.badgeText}>{lives}</Text>
                    </View>
                  )}
                </View>
              </View>

             
              <Text style={styles.questionText}>
                {selectedQuestions[currentQuestion].text}
              </Text>{/* Варианты ответов */}
              {difficulty === 'Easy' ? (
                <View style={styles.answersContainer}>
                  <TouchableOpacity
                    style={styles.answerButton}
                    onPress={() => handleAnswerSelection('True')}
                  >
                    <Text style={styles.answerText}>True</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.answerButton}
                    onPress={() => handleAnswerSelection('False')}
                  >
                    <Text style={styles.answerText}>False</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View
                    style={styles.dropZone}
                    ref={dropZoneRef}
                    onLayout={onDropZoneLayout}
                  >
                    <Text style={styles.dropZoneText}>
                      {selectedAnswer
                        ? `Selected Answer: ${selectedAnswer}`
                        : 'Drop your answer here'}
                    </Text>
                  </View>
                  <View style={styles.answersContainer}>
                    {answers.map((answer, index) =>
                      positions[index] ? (
                        <Draggable
                          key={`draggable-${index}`}
                          x={positions[index].x}
                          y={positions[index].y}
                          renderSize={60}
                          shouldReverse={true} // Элемент возвращается на исходную позицию после отпускания
                          onDragRelease={(e, gestureState, bounds) =>
                            handleDragRelease(index, gestureState.moveX, gestureState.moveY)
                          }
                        >
                          <View style={styles.draggableItem}>
                            <Text style={styles.draggableText}>{answer}</Text>
                          </View>
                        </Draggable>
                      ) : null
                    )}
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.checkButton,
                      { backgroundColor: selectedAnswer ? '#4CAF50' : '#A5D6A7' },
                    ]}
                    onPress={handleCheckAnswer}
                    disabled={!selectedAnswer}
                  >
                   <Text style={styles.checkButtonText}>Check Answer</Text>

                  </TouchableOpacity>
                </View>
                
              )}
              <TouchableOpacity style={styles.shopButton} onPress={() => setIsShopVisible(true)}>
  <Image source={require('../assets/shop.png')} style={styles.shopIcon} />
</TouchableOpacity>
            </View>
          )}

         
          {gameOver && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={gameOver}
              onRequestClose={() => setGameOver(false)}
            >
                <ImageBackground source={require('../assets/back.png')} style={styles.background}>
              <View style={styles.modalcontent}>
              <Image source={require('../assets/smiley.png')} style={styles.image} />
                <Text style={styles.gameOverText}>You were wrong. You have nothing left</Text> 
                <Image source={require('../assets/heart-icon.png')} style={styles.icon} />
                <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
                  <Text style={styles.restartText}>Restart</Text>
                </TouchableOpacity>
              </View>
              </ImageBackground>
            </Modal>
          )}{/* Модальное окно "Completed" */}
          {completed && (
            <Modal
              animationType="slide"
              transparent={true}
              visible={completed}
              onRequestClose={() => setCompleted(false)}
            >
                <ImageBackground source={require('../assets/back.png')} style={styles.background}>
              <View style={styles.modalContainer}>
                <Text style={styles.congratulationsText}>🎉 You completed the quiz!</Text>
                <Text style={styles.scoreText}>Your score: {balance} </Text>
                <TouchableOpacity style={styles.playAgainButton} onPress={restartGame}>
                  <Text style={styles.playAgainText}>Play Again</Text>
                </TouchableOpacity>
              </View>
              </ImageBackground>
            </Modal>
            
          )}
         <Modal
        animationType="slide"
        transparent={true}
        visible={showBonusModal}
        onRequestClose={() => setShowBonusModal(false)}
      >
        <ImageBackground source={require('../assets/back.png')} style={styles.background}>
          <View style={styles.modalcontent}>
            <Text style={styles.gameOverText}>Daily Bonus</Text>
            <Text style={styles.bonusText}>
              You have a chance to receive one of the following bonuses:
              {dailyBonus === 'Life' && <Text style={styles.bonusDescription}>1 Extra Life</Text>}
              {dailyBonus === 'Hint' && <Text style={styles.bonusDescription}>1 Extra Hint</Text>}
              {dailyBonus === 'Coins' && <Text style={styles.bonusDescription}>100 Coins</Text>}
            </Text>
            <TouchableOpacity style={styles.bonusButton} onPress={applyBonus}>
              <Text style={styles.bonusButtonText}>Claim Bonus</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Modal>


<Modal
  animationType="slide"
  transparent={true}
  visible={isShopVisible}
  onRequestClose={() => setIsShopVisible(false)}
>
<ImageBackground source={require('../assets/back.png')} style={styles.background}>
  <View style={styles.modalOverlay}>
    
    <View style={styles.modalContainer}>
      {/* Крестик для закрытия модального окна */}
      <TouchableOpacity style={styles.closeButton} onPress={() => setIsShopVisible(false)}>
        <Image source={require('../assets/x.png')} style={styles.closeIcon} />
      </TouchableOpacity>
      
      {/* Заголовок магазина */}
      <Image source={require('../assets/shop.png')} style={styles.shop} />
      <Text style={styles.modalTitle}>Shop</Text>
      
      {/* Кнопка покупки Подсказки */}
      <TouchableOpacity style={styles.purchaseButton} onPress={handleBuyHints}>
      
      <Image source={require('../assets/hint-icon.png')} style={styles.icon} />
        <Text style={styles.purchaseText}>Buy Hint - 200 Coins</Text>
      </TouchableOpacity>
      
      {/* Кнопка покупки Жизни */}
      <TouchableOpacity style={styles.purchaseButton} onPress={handleBuyLives}>
      <Image source={require('../assets/heart-icon.png')} style={styles.icon} />
        <Text style={styles.purchaseText}>Buy Life - 200 Coins</Text>
      </TouchableOpacity>
    </View>
  </View>
  </ImageBackground>
</Modal>
        </View>
        </SafeAreaView>
      </ImageBackground>

  );
};
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalcontent: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
  },
  gameOverText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
  bonusText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  bonusDescription: {
    fontSize: 16,
    color: '#ffcc00',
  },
  bonusButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  bonusButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  levelButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ff6347',
    borderRadius: 5,
  },
  levelText: {
    color: '#fff',
    fontSize: 18,
  },

    image:{
        width:80,
        height:80,
        marginBottom:10,
    },
    shop:{
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    shopButton: {
        position: 'absolute',
        bottom: -16,
        right: -15,
        backgroundColor: '#72c7c5',
        padding: 12,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#007f7d',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5, // Для Android
      },
      shopIcon: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        
      },
      
      // Модальное окно "Shop"
      modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
       
      },
      modalcontent:{
        marginTop:240,
        alignSelf:'center',
        width: '90%',
        backgroundColor: '#007f7d',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        position: 'relative',
      },
      modalContainer: {
        
        alignSelf:'center',
        width: '90%',
        backgroundColor: '#007f7d',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        position: 'relative',
      },
      closeButton: {
        alignContent:'flex-end',
        top: -10,
        right: -130,
      },
      closeIcon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
      },
      modalTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#fff',
      },
      purchaseButton: {
        backgroundColor: '#72c7c5',
        padding: 15,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#fff',
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
      },
      purchaseText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
      },
    safeArea: {
      flex: 1,
     
    },
    background: {
      flex: 1,
      resizeMode: 'cover',
    },
    container: {
      flex: 1,
      padding: 20,
    },
    welcomeContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#007f7d',
    },
    levelButton: {
      backgroundColor: '#72c7c5',
      padding: 15,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#007f7d',
      marginBottom: 15,
      width: 200,
      alignItems: 'center',
    },
    levelText: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold',
    },
    quizContainer: {
      flex: 1,
      padding: 20,
    },
    header: {
      
      alignItems: 'flex-end',
      marginTop:-40,
    },
    backButton: {
      top:-10,
      left:30,
      padding: 10,
     
    },
    backIcon: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
    
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      width: '100%',
    },
    iconContainer: {
      position: 'relative',
    },
    icon: {
      width: 30,
      height: 30,
      resizeMode: 'contain',
    },
    iconBadge: {
      position: 'absolute',
      top: -5,
      right: -10,
      backgroundColor: 'red',
      borderRadius: 10,
      paddingHorizontal: 5,
      paddingVertical: 1,
      minWidth: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    balanceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    balanceText: {
      fontSize: 16,
      color: '#007f7d',
      fontWeight: 'bold',
      marginLeft: 5,
    },
    questionText: {
      fontSize: 20,
      textAlign: 'center',
      marginBottom: 20,
      color: '#007f7d',
      fontWeight: 'bold',
    },
    answersContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: 20,
    },
    answerButton: {
      backgroundColor: '#72c7c5',
      padding: 15,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#007f7d',
      alignItems: 'center',
      margin: 10,
      width: 120,
      height: 60,
      justifyContent: 'center',
    },
    answerText: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold',
    },
    dropZone: {
        marginTop:-10,
      height: 70,
      backgroundColor: '#e0f7f6',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 25,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: '#007f7d',
    },
    dropZoneText: {
      fontSize: 18,
      color: '#007f7d',
    },
    draggableItem: {
      width: 90,
      height: 90,
      backgroundColor: '#72c7c5',
      borderRadius: 50,
      borderWidth: 2,
      borderColor: '#007f7d',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3, // Добавляет тень для Android
      marginVertical: 10,
    },
    draggableText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: 'bold',textAlign: 'center',
    },
    checkButton: {
      alignSelf: 'center',
      padding: 15,
      marginTop: 60,
      borderRadius: 50,
      width: 90,
      height: 90,
      backgroundColor: '#72c7c5',
      borderWidth: 2,
      borderColor: '#007f7d',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3, // Добавляет тень для Android
      marginVertical: 10,
    },
    checkButtonText: {
      fontSize: 16,
      color: '#fff',
      textAlign: 'center',
    },
    checkIcon: {
      width: 30,
      height: 30,
      resizeMode: 'contain',
      tintColor: '#fff',
    },
    
    gameOverText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 20,
      textAlign: 'center',
    },
    restartButton: {
      backgroundColor: '#72c7c5',
      padding: 10,
      borderRadius: 12,borderWidth: 2,
      borderColor: '#007f7d',
      width: 150,
      alignItems: 'center',
    },
    restartText: {
      fontSize: 16,
      color: '#fff',
    },
    congratulationsText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#007f7d',
      marginBottom: 20,
      textAlign: 'center',
    },
    scoreText: {
      fontSize: 18,
      color: '#007f7d',
      marginBottom: 10,
      textAlign: 'center',
    },
    playAgainButton: {
      backgroundColor: '#72c7c5',
      padding: 10,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#007f7d',
      width: 200,
      alignItems: 'center',
      marginBottom: 10,
    },
    playAgainText: {
      fontSize: 16,
      color: '#fff',
      fontWeight: 'bold',
    },
  });
  
  export default QuizApp;