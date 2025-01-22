import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ImageBackground,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Импортируем useFocusEffect

const background = require('../assets/back.png');
const closeIcon = require('../assets/x.png');

// Три картинки (01.jpg, 02.jpg, 03.jpg)
const waterPurificationImg = require('../assets/01.jpg');
const waterInWildImg = require('../assets/02.jpg');
const expertImg = require('../assets/03.jpg');

// Иконка замка
const lockedImg = require('../assets/lock.png');


const initialTopics = [
    {
      id: 1,
      title: 'Water purification',
      locked: false,
      image: waterPurificationImg,
      articles: [
        {
          id: 101,
          title: '5 Simple Ways to Purify Water at Home',
          image: require('../assets/001.jpg'),
          text: `Did you know that water can be a source of not just life but also danger? Contaminated water can contain harmful bacteria, viruses, and toxins. Therefore, it’s important to know how to purify it. Here are five simple methods you can use at home:
  Boiling: This is an old but gold method! Boiling water not only kills most harmful microorganisms but also raises the water temperature, which can be pleasant on cold days. Of course, remember that boiling does not remove chemical contaminants!
  Filtration through Charcoal: Using activated charcoal is an effective way to remove unpleasant odors and tastes. Charcoal absorbs impurities that may be hazardous to your health. It's a great way to improve water quality!
  Settling: This simple method may surprise you. Let water sit for a few hours, and you'll see particles settling at the bottom. You can carefully pour the clean water from the top. It's easy but very effective!
  Solar Purification: It may seem like you’re drinking regular water, but you’re actually practicing magic! Fill transparent plastic bottles with water and leave them in the sun. UV rays will destroy harmful bacteria, giving you safe water.
  Chemical Tablets: If you’re a traveler, this is your best friend! Water purification tablets kill microorganisms, and it’s so easy—just dissolve a tablet in water and let it sit. Perfect for emergencies!
  These methods will help you ensure clean and safe water for you and your family.
  `,
        },
        {
          id: 102,
          title: "How to Choose the Best Water Purifier: A Beginner's Guide",
          image: require('../assets/002.jpg'),
          text: `In our time, access to clean water is not just a privilege but a necessity. With so many filters available, it can be overwhelming to choose! Here are some tips on how to pick the best filter for your needs:
  Understanding Types of Filters:
  Pitcher Filters: Ideal for small amounts of water. Just fill the pitcher with water, and it gets purified.
  Reverse Osmosis Systems: This is like a superhero filter! It removes up to 99% of contaminants but requires more space and maintenance.
  Tap-Mounted Filters: A great solution for daily use. They are quick and convenient, providing access to purified water without hassle.
  Your Needs: Consider how much water you consume. If your family is large or you often have guests, you’ll need a filter that can handle larger volumes of water.
  Quality of Your Water: Test your water to find out what contaminants concern you. This will help you find a filter that can tackle specific issues.
  Certifications: Don’t forget about safety! Choose filters with certifications from independent organizations. This indicates that your filter meets safety standards.
  Budget: Consider not just the price of the filter but also maintenance costs. Choose a filter that fits your budget and ensures clean water without excessive expenses.
  By choosing a filter, you’re not just investing in equipment—you’re investing in your health and well-being!
  `,
        },
        {
          id: 103,
          title: "Why Boiling Water Isn’t Always Enough",
          image: require('../assets/003.jpg'),
          text: `Boiling water is a classic method used by millions. But is it really sufficient? Let’s break it down!
  Doesn't Remove All Contaminants: Boiling effectively kills bacteria and viruses, but heavy metals, pesticides, and chemical pollutants remain in the water. So, if your water is contaminated with these substances, boiling won't help.
  Duration of Boiling: Boiling may not be effective unless you do it long enough. Altitude also affects this—at high altitudes, water boils at a lower temperature, which reduces the effectiveness of disinfection.
  Impact on Taste: Prolonged boiling can lead to the loss of some beneficial trace elements and alter the taste of the water. You might end up with safe but unpleasant-tasting water.
  Energy Consumption: Boiling can be energy-intensive. In remote areas where electricity is a luxury, this can be a problem.
  Risks: Boiling may not be sufficient in cases of contaminants that require specific purification methods. For instance, if your water has a specific chemical composition, it’s better to consult professionals.
  Boiling is good, but not always enough. Use a combination of methods to ensure your water’s purity!
  `,
        },
        {
          id: 104,
          title: 'Comparing Water Purification Technologies',
          image: require('../assets/004.jpg'),
          text: `When it comes to water purification, there are countless technologies. Among them, reverse osmosis (RO) and ultrafiltration (UF) are two popular methods that deserve your attention.
  Reverse Osmosis (RO):
  How It Works: This system uses a semi-permeable membrane that blocks most contaminants. It’s a technology that provides excellent water quality, removing up to 99% of unwanted substances.
  Advantages: High efficiency in removing chemical pollutants, heavy metals, and even some viruses. It’s a reliable solution for health-conscious individuals.
  Disadvantages: Reverse osmosis systems often require maintenance, including replacing membranes and cartridges. They also take up a lot of space and require water supply.
  Ultrafiltration (UF):
  How It Works: This technology uses a membrane with larger pores that removes bacteria, colloids, and particles, while allowing dissolved salts and minerals to pass through.
  Advantages: Energy-efficient and doesn’t require electricity. It’s an excellent option for areas with limited access to power.
  Disadvantages: While ultrafiltration effectively removes bacteria, it’s not as efficient at removing chemical pollutants as reverse osmosis.
  Conclusion: When choosing between these technologies, consider your needs. If you require high water quality, reverse osmosis is your choice. For basic purification, ultrafiltration can be an effective alternative.`,
        },
        {
          id: 105,
          title: 'Most Effective Methods for Water Purification While Traveling',
          image: require('../assets/005.jpg'),
          text: `Traveling can be exciting, but many of us face the challenge of accessing clean water. Here are the most effective water purification methods you can use while traveling:
  Boiling: This is a reliable method. Carry a lightweight camping kettle. In the mountains, boil water for at least 5 minutes to kill harmful microorganisms.
  Portable Filters: There are many filters that can be used in the field. They are lightweight, easy to use, and can purify water in minutes.
  Solar Purification: Use the natural power of the sun! This is a free and eco-friendly purification method. Leave bottles of water under direct sunlight.
  Chemical Tablets: This is a simple solution for travelers. Always carry water purification tablets with you. They are lightweight, compact, and capable of killing bacteria in the water.
  Rainwater Harvesting: During rainy weather, you can collect rainwater. However, it should be treated before consumption, such as boiling.
  Conclusion: When traveling, it’s important to have a plan. Use these methods to ensure safe water so that your adventures are memorable and safe!
  `,
        },
      ],
    },
    {
      id: 2,
      title: 'Finding Water in the Wild: A Survival Guide',
      locked: false,
      image: waterInWildImg,
      articles: [
        {
          id: 201,
          title: 'Finding Water: Part 1',
          image: require('../assets/006.jpg'),
          text: `Vegetation:
  Green Plants: Dense patches of green vegetation often indicate nearby water sources. Plants like willows, alders, and ferns tend to grow near water.
  Moss: In forested areas, look for moss; it usually thrives in moist environments, suggesting proximity to water.
  Animal Activity:
  Wildlife Trails: Animals often follow paths to and from water sources. Observe the ground for trails or tracks leading to areas where animals gather.
  Birds: Listen for bird calls. Birds often gather near water, especially during hot weather.
  `,
        },
        {
          id: 202,
          title: 'Finding Water: Part 2',
          image: require('../assets/007.jpg'),
          text: `Streams and Rivers:
  Gradient Changes: Water often flows downhill, so valleys and low-lying areas are good places to search for streams. Look for changes in elevation.
  Shiny Surfaces: If you see reflections or shiny surfaces in the distance, it may indicate a body of water.
  Lakes and Ponds:
  Landforms: Lakes are usually found in flat areas surrounded by hills or mountains. If you're in a mountainous region, look for depressions where water might collect.
  Wetlands: Swamps and marshes can be rich sources of water, though the water may not be clean and may require purification.
  `,
        },
        {
          id: 203,
          title: 'Finding Water: Part 3',
          image: require('../assets/008.jpg'),
          text: `Dew and Condensation:
  Morning Dew: In the early morning, you can collect dew from leaves. Use a cloth to wipe the leaves and then wring it out into a container.
  Solar Still: Dig a hole in the ground and place a container in the center. Cover the hole with plastic wrap, securing the edges with rocks. As the sun heats the ground, moisture will evaporate and condense on the underside of the plastic.
  Rainwater Harvesting:
  Tarps and Cloth: If it rains, spread out a tarp or cloth to catch rainwater. Collect it in containers for drinking.
  `,
        },
        {
          id: 204,
          title: 'Finding Water: Part 4',
          image: require('../assets/009.jpg'),
          text: `Beneath Rocks and Roots:
  Digging: If you see signs of moisture in the ground (like mud or wet earth), dig a small hole. Water may collect as you dig deeper, especially in riverbeds.
  Caves and Overhangs:
  Seepage: Water often seeps from cave walls or rock overhangs. Look for drips or wet spots and collect water from there.
  `,
        },
        {
          id: 205,
          title: 'Finding Water: Part 5',
          image: require('../assets/010.jpg'),
          text: `Always purify water from natural sources to ensure it’s safe to drink. Here are some methods:
  Boiling: Boil water for at least 5 minutes to kill harmful microorganisms.
  Filtration: Use a portable water filter or a cloth to filter out sediments.
  Chemical Treatment: If available, use purification tablets or drops to kill pathogens.
  `,
        },
      ],
    },
  
    {
      id: 3,
      title: 'Expert Advice',
      locked: true, 
      image: expertImg,
      articles: [
        {
          id: 301,
          title: 'Expert Advice on Water Consumption',
          image: require('../assets/guide.jpg'),
          text: `Hello!
Congratulations! You have unlocked a unique guide from an expert! 
In this guide, you will find all the secrets to proper water consumption that will help you improve your health and overall well-being.
Ready to learn more? Click the button below to access the information!
`,
        },
        {
            id: 302,
            title: 'Understanding Your Water Needs',
            image: require('../assets/302.jpg'),
            text: `Individual Needs: The amount of water you need to consume depends on many factors, including age, gender, activity level, climate, and health status. Generally, it is recommended to drink about 2-3 liters of water a day for adults.
Listen to Your Body: Pay attention to your feelings. If you feel thirsty, it’s a sign that your body needs fluids.
  `,
          },
          {
            id: 303,
            title: 'Water Consumption Throughout the Day',
            image: require('../assets/303.jpg'),
            text: `Spread Consumption: Try to distribute your water intake throughout the day rather than drinking large amounts at once. It is advisable to drink a glass of water in the morning after waking up, as well as before each meal.
Reminders: Set reminders on your phone or use apps to track your water intake to ensure you don’t forget to drink.
  `,
          },
          {
            id: 304,
            title: 'Secrets to Staying Hydrated During Activity',
            image: require('../assets/304.jpg'),
            text: `Before Physical Activity: Drink water 30-60 minutes before exercising to prepare your body. Depending on the intensity of the workout, also drink water during exercise.
After Workouts: After physical activity, don’t forget to restore your fluid balance by drinking enough water.
  `,
          },
          {
            id: 305,
            title: 'Choosing the Right Beverages',
            image: require('../assets/305.jpg'),
            text: `Natural Water: Drink clean water instead of carbonated or sugary beverages that may contain high amounts of sugar and calories. If you find it hard to drink plain water, try adding lemon or mint for flavor.
Avoid Energy Drinks: Energy and carbonated drinks can lead to dehydration, so try to minimize their consumption.
  `,
          },
          {
            id: 306,
            title: 'Healthy Eating and Water',
            image: require('../assets/306.jpg'),
            text: `Fruits and Vegetables: Many fruits and vegetables, such as watermelon, cucumbers, and oranges, contain a lot of water and can help maintain hydration levels.
Soups and Broths: Include liquid dishes in your diet, which can help you get additional fluids.
  `,
          },
      ],
    },
  ];
  


const { width } = Dimensions.get('window');

const AllAboutWater = () => {
    const [topicsData, setTopicsData] = useState(initialTopics);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
    const [currentArticleIndex, setCurrentArticleIndex] = useState(0);

    // Используем useFocusEffect для проверки при каждом фокусе экрана
    useFocusEffect(
      React.useCallback(() => {
        const checkExpertUnlocked = async () => {
          try {
            const isUnlocked = await AsyncStorage.getItem('expertUnlocked');
            setTopicsData((prev) =>
              prev.map((topic) =>
                topic.id === 3 ? { ...topic, locked: isUnlocked === 'true' ? false : true } : topic
              )
            );
          } catch (err) {
            console.log('Error reading expertUnlocked', err);
          }
        };
        checkExpertUnlocked();
      }, [])
    );

    const openTopic = (topicIndex) => {
      const topic = topicsData[topicIndex];
      if (topic.locked) {
        alert('This topic is locked. Collect your daily bonus to unlock!');
        return;
      }
      setCurrentTopicIndex(topicIndex);
      setCurrentArticleIndex(0);
      setModalVisible(true);
    };

    // Закрыть модалку
    const closeModal = () => {
      setModalVisible(false);
    };

    // Переключение статей
    const goPrevArticle = () => {
      const articles = topicsData[currentTopicIndex].articles;
      setCurrentArticleIndex((prev) => (prev - 1 + articles.length) % articles.length);
    };
    const goNextArticle = () => {
      const articles = topicsData[currentTopicIndex].articles;
      setCurrentArticleIndex((prev) => (prev + 1) % articles.length);
    };

    const currentTopic = topicsData[currentTopicIndex];
    const currentArticle = currentTopic.articles[currentArticleIndex];

    return (
      <ImageBackground source={background} style={styles.bg}>
        <ScrollView style={styles.container}>
          <SafeAreaView>
          <Text style={styles.header}>Articles</Text>

          {topicsData.map((topic, idx) => {
            const topicIsLocked = topic.locked;
            return (
              <TouchableOpacity
                key={topic.id}
                style={styles.topicCard}
                onPress={() => openTopic(idx)}
                activeOpacity={topicIsLocked ? 1 : 0.7}
              >
              
                {topicIsLocked ? (
                  <Image
                    source={lockedImg}
                    style={styles.lockIconFullSize}
                  />
                ) : (
                  <Image
                    source={topic.image}
                    style={styles.topicImage}
                  />
                )}<Text
                  style={[
                    styles.topicTitle,
                    topicIsLocked && styles.lockedText,
                  ]}
                >
                  {topic.title}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Модальное окно на весь экран */}
          <Modal visible={modalVisible} animationType="slide" transparent={false}>
            <ImageBackground source={background} style={styles.modalFullScreen}>
              <SafeAreaView>
      
              

           <ScrollView contentContainerStyle={styles.scrollContent}>
           <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Image source={closeIcon} style={styles.closeIcon} />
              </TouchableOpacity>
                {currentArticle?.image && (
                  <Image
                    source={currentArticle.image}
                    style={
                      currentArticle.id === 301
                        ? styles.firstArticleImage
                        : styles.articleImage      // Дефолтный стиль
                    }
                  />
                )}
                <Text style={styles.articleTitle}>{currentArticle?.title}</Text>
                <Text style={styles.articleText}>{currentArticle?.text}</Text>

                <View style={styles.navContainer}>
                  {currentArticle.id === 301 ? (
                    <TouchableOpacity
                      style={styles.nextButton}
                      onPress={() => setCurrentArticleIndex(1)}
                    >
                      <Text style={styles.nextButtonText}>Go to the guide</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.navArrows}>
                      <TouchableOpacity style={styles.arrowButton} onPress={goPrevArticle}>
                        <Text style={styles.arrowText}>{'<'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.arrowButton} onPress={goNextArticle}>
                        <Text style={styles.arrowText}>{'>'}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </ScrollView>
              </SafeAreaView>
            </ImageBackground>
          </Modal>
          </SafeAreaView>
        </ScrollView>
      </ImageBackground>
    );
};
export default AllAboutWater;

const styles = StyleSheet.create({
    navContainer: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
        alignItems: 'center',
      },
      nextButton: {
        marginBottom:-10,
        borderWidth:2,
        borderColor:'white',
        backgroundColor: '#72c7c5',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,

      },
      nextButtonText: {
        
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      navArrows: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
      },
     
      arrowText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
      },
    firstArticleImage: {
        width: 200, 
        height: 250, 
        borderRadius: 15,
        marginBottom: 30,
        marginTop: 90,
        
      },
     
  bg: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#055a5c',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Карточка одной темы
  topicCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth:3,
    borderColor:'#055a5c',
    marginBottom: 15,
    padding: 15,
    alignItems: 'center',
  },

 
  lockedText: {
    color: '#999',
  },

  // Обычная картинка (если тема не заблокирована)
  topicImage: {
    width: 100,
    height: 100,
    borderRadius: 14,
    marginBottom: 10,
    resizeMode: 'cover',
  },

  // Иконка замка вместо картинки
  lockIconFullSize: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'contain',
  },

  topicTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },

  // Модальное окно
  modalFullScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    
  
  },
  closeIcon: {
    width: 50,
    height: 50,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 80,
    alignItems: 'center',
  },
  articleImage: {
    width: 280,
    height: 190,
    borderRadius: 12,
    marginBottom: 30,
    marginTop: 10,
    resizeMode: 'cover',
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#055a5c',
    marginBottom: 10,
    textAlign: 'center',
  },
  articleText: {
    backgroundColor: 'rgba(114, 199, 197, 0.8)',
    borderRadius:25,
    borderWidth:3,
    borderColor:'white',
    padding:10,
    fontSize: 20,
    color: '#055a5c',
    textAlign: 'justify',
  },

  // Стрелки внизу
  navArrows: {
    position: 'absolute',
    bottom: -15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  arrowButton: {
    backgroundColor: '#72c7c5',
    borderRadius: 10,
    borderWidth:3,
    borderColor:'white',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  arrowText: {
    backgroundColor: 'rgba(114, 199, 197, 0.8)',
    borderRadius:25,
    borderWidth:2,
    borderColor:'#72c7c5',
    fontSize: 20,
    color: '#055a5c',
    fontWeight: 'bold',
  },
});

