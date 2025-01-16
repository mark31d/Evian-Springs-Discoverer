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
import MapScreen from './Components/MapScreen';
import FolderScreen from './Components/FolderScreen';

// Дополнительные провайдеры и компоненты
import Loader from './Components/LoaderScript';
import { AudioProvider } from './Components/AudioScript';
import { VibrationProvider } from './Components/Vibration';
import { UserProvider } from './Components/UserContext'; // Импортируем UserProvider

const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#72c7c5',
          height: 80,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#1B4F72',
        tabBarLabelStyle: {
          marginTop: 10,
          fontSize: 14,
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
              source={require('./assets/home.png')}
              style={{
                width: 45,
                height: 45,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
        // Переопределяем нажатие, чтобы не было перехода
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            console.log('Tab "Home" was pressed, but navigation is prevented.');
          },
        }}
      />

      <Tab.Screen
        name="SourceMap"
        component={SourceMap}
        options={{
          tabBarLabel: 'Sources',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./assets/drinking-water.png')}
              style={{
                width: 40,
                height: 40,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            console.log('Tab "Sources" was pressed, but navigation is prevented.');
          },
        }}
      />

      <Tab.Screen
        name="WaterPurityCheck"
        component={WaterPurityCheck}
        options={{
          tabBarLabel: 'Check',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./assets/clean.png')}
              style={{
                width: 40,
                height: 40,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            console.log('Tab "Check" was pressed, but navigation is prevented.');
          },
        }}
      /><Tab.Screen
        name="AllAboutWater"
        component={AllAboutWater}
        options={{
          tabBarLabel: 'Articles',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./assets/articles.png')}
              style={{
                width: 40,
                height: 40,
                opacity: focused ? 1 : 0.5,
              }}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            console.log('Tab "Articles" was pressed, but navigation is prevented.');
          },
        }}
      />

      <Tab.Screen
        name="QuizApp"
        component={QuizApp}
        options={{
          tabBarLabel: 'Quiz',
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('./assets/quiz.png')}
              style={{
                width: 50,
                height: 50,
                opacity: focused ? 1 : 0.7,
              }}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            console.log('Tab "Quiz" was pressed, but navigation is prevented.');
          },
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
      <Stack.Screen name="FolderScreen" component={FolderScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
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