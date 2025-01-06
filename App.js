import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

// Экраны
import Menu from './Components/Menu';
import SourceMap from './Components/sourceMap';
import WaterPurityCheck from './Components/WaterPurityCheck';
import AllAboutWater from './Components/AllAboutWater';
import WelcomeAndQuiz from './Components/WelcomeAndQuiz';
import Settings from './Components/Settings';
import LoginPart from './Components/LoginPart';
import QuizApp from './Components/QuizApp';
import Results from './Components/Results';
import About from './Components/About';
// Дополнительные провайдеры и компоненты
import Loader from './Components/LoaderScript';
import { AudioProvider } from './Components/AudioScript';
import { VibrationProvider } from './Components/Vibration';
import { UserProvider } from './Components/UserContext'; // Импортируем UserProvider

// Определяем вкладки (Tab Navigator)
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
   
<Tab.Navigator
screenOptions={{
  headerShown: false,
  tabBarStyle: {
    backgroundColor: '#72c7c5',
    height: 80, // Увеличенная высота панели вкладок
    paddingBottom: 10,
    paddingTop: 5,
  },
  tabBarActiveTintColor: '#fff',
  tabBarInactiveTintColor: '#1B4F72',
  tabBarLabelStyle: {
    marginTop:10,
    fontSize: 14, // Увеличенный размер текста меток
    marginBottom: 5,
  },
}}
>
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./assets/home.png')} // Оригинальное изображение
              style={{
                width: 45, // Увеличенный размер иконки
                height: 45,
                opacity: focused ? 1 : 0.5, // Меняем прозрачность
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="SourceMap"
        component={SourceMap}
        options={{
          tabBarLabel: 'Sources',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./assets/drinking-water.png')} // Оригинальное изображение
              style={{
                width: 40,
                height: 40,
                opacity: focused ? 1 : 0.5, // Меняем прозрачность
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="WaterPurityCheck"
        component={WaterPurityCheck}
        options={{
          tabBarLabel: 'Check',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./assets/clean.png')} // Оригинальное изображение
              style={{
                width: 40,
                height: 40,
                opacity: focused ? 1 : 0.5, // Меняем прозрачность
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="AllAboutWater"
        component={AllAboutWater}
        options={{
          tabBarLabel: 'Articles',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./assets/articles.png')} // Оригинальное изображение
              style={{
                width: 40,
                height: 40,
                opacity: focused ? 1 : 0.5, // Меняем прозрачность
              }}
            />
          ),
        }}
      /><Tab.Screen
        name="QuizApp"
        component={QuizApp}
        options={{
          tabBarLabel: 'Quiz',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./assets/quiz.png')} // Оригинальное изображение
              style={{
                width: 50, // Более крупная иконка для QuizApp
                height: 50,
                opacity: focused ? 1 : 0.7, // Меняем прозрачность
              }}
            />
          ),
        }}
      />

     
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'default',
      }}
    >
      <Stack.Screen name="WelcomeAndQuiz" component={WelcomeAndQuiz} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="LoginPart" component={LoginPart} />
      <Stack.Screen name="Results" component={Results} />
      <Stack.Screen name="About" component={About} />
    </Stack.Navigator>
  );
}


export default function App() {
  const [loaderIsEnded, setLoaderIsEnded] = useState(false);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <VibrationProvider>
        <AudioProvider>
          <UserProvider> 
            <NavigationContainer>
              {!loaderIsEnded ? (
                <Loader onEnd={() => setLoaderIsEnded(true)} />
              ) : (
                <RootStack />
              )}
            </NavigationContainer>
          </UserProvider>
        </AudioProvider>
      </VibrationProvider>
    </GestureHandlerRootView>
  );
}