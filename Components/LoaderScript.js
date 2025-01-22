import React, { useEffect, useRef } from 'react'; 
import { View, Animated, Text, StyleSheet, ImageBackground, Image, Dimensions } from 'react-native';

const LoaderScript = ({ onEnd }) => {
  const appearingAnim = useRef(new Animated.Value(0)).current; 
  const disappearingAnim = useRef(new Animated.Value(1)).current; 
  const { width } = Dimensions.get('window'); 

  useEffect(() => {
    Animated.timing(appearingAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(disappearingAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => onEnd()); 
    }, 8000);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/back.png')} 
      style={styles.backgroundImage}
    >
      <Animated.View
        style={[
          styles.loaderContainer,
          { opacity: disappearingAnim }, 
        ]}
      >
       
        <Animated.Text
          style={[
            styles.loaderText,
            { opacity: appearingAnim }, 
          ]}
        >
         Evilen Springs Discoverer

        </Animated.Text>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center',
  },
  loaderContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 60,
    color: '#72c7c5',
    marginBottom: 10,
  },
  logoImage: {
    alignSelf: 'center',
    marginBottom: -60,
    borderRadius: 200,
  },
});

export default LoaderScript;