import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ImageBackground, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const About = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground source={require('../assets/back.png')} style={styles.background}>
      <SafeAreaView>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Кнопка "Назад" */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Image source={require('../assets/x.png')} style={styles.backIcon} />
          </TouchableOpacity>

          {/* Изображение перед текстом */}
          <Image source={require('../assets/about.jpg')} style={styles.aboutImage} />

          {/* Контейнер для текста с фоновым цветом */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>About Us</Text>

            <Text style={styles.paragraph}>
              Welcome to the world of Evilen Springs Discoverer! 🌊 Our app is your guide in the vast ocean of knowledge about water that enriches our lives. We aim to unveil the beauty of natural springs and provide insights to help you consume this invaluable resource wisely.
            </Text>

            <Text style={styles.subtitle}>Natural Springs Cards:</Text>
            <Text style={styles.paragraph}>
              Discover a variety of natural springs scattered like precious gems. Each card offers captivating stories, characteristics, and health benefits.
            </Text>

            <Text style={styles.subtitle}>Water Consumption Guide:</Text>
            <Text style={styles.paragraph}>
              Our experts share tips that resemble the gentle whisper of a stream, helping you transform every sip into a true elixir of life.
            </Text>

            <Text style={styles.subtitle}>Water Purity Assessment:</Text>
            <Text style={styles.paragraph}>
              Use our tools to assess water purity, ensuring you always know the quality of what you drink.
            </Text>

            <Text style={styles.subtitle}>Everything About Water:</Text>
            <Text style={styles.paragraph}>
              Explore articles that reveal secrets about purification and sourcing in the wild, along with invaluable tips for overcoming challenges.
            </Text>

            <Text style={styles.subtitle}>Interesting Facts About Water:</Text>
            <Text style={styles.paragraph}>
              Immerse yourself in captivating facts that deepen your understanding of this essential resource.
            </Text>

            <Text style={styles.subtitle}>Water Chemistry:</Text>
            <Text style={styles.paragraph}>
              Dive into our quiz to explore the mysteries of water chemistry, enhancing your knowledge in a fun and engaging way.
            </Text>

            <Text style={styles.paragraph}>
              With Springs Discoverer, you can explore, learn, and enjoy every drop of water that enriches our lives. 🌍💧
            </Text>
          </View>
        </View>
        
      </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backButton: {
    alignSelf: 'flex-end',
    padding:8,
  },
  backIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  aboutImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover', // Используем 'cover' для заполнения контейнера
    marginTop: 20, // Отступ сверху для размещения ниже кнопки "Назад"
    marginBottom: 20,
    borderRadius: 25, // Скругление углов (половина размера для круглого изображения)
    borderWidth: 2,
    borderColor: '#007f7d',
    overflow: 'hidden', // Обеспечивает правильное отображение скругленных углов
  },
  textContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Полупрозрачный белый фон для читаемости
    padding: 10,
    borderRadius: 15,
    width: '100%',
   
  },
  title: {
    
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007f7d',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007f7d',
    marginTop: 15,
    marginBottom: 5,
  },
  paragraph: {
    
    fontSize: 18,
    color: '#007f7d',
    marginTop: 5,
   
    textAlign: 'justify',
    fontWeight:'bold',
  },
});

export default About;