import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

const AudioScript = createContext();
let backgroundMusic = null;

export const AudioProvider = ({ children }) => {
   const [isMusicPlaying, setIsMusicPlaying] = useState(true);
   const [volume, setVolume] = useState(1);

   useEffect(() => {
       backgroundMusic = new Sound(require('../assets/rain_drops.mp3'), (error) => {
           if (error) {
               console.log('Error loading sound:', error);
           } else {
               backgroundMusic.setNumberOfLoops(-1);
               backgroundMusic.setVolume(volume);
               if (isMusicPlaying) {
                   backgroundMusic.play();
               }
           }
       });

       return () => {
           if (backgroundMusic) {
               backgroundMusic.stop();
               backgroundMusic.release();
               backgroundMusic = null;
           }
       };
   }, []);

   useEffect(() => {
       if (backgroundMusic) {
           backgroundMusic.setVolume(volume);
           if (isMusicPlaying) {
               backgroundMusic.play();
           } else {
               backgroundMusic.pause();
           }
       }
   }, [isMusicPlaying, volume]);

   return (
       <AudioScript.Provider value={{ isMusicPlaying, setIsMusicPlaying, volume, setVolume }}>
           {children}
       </AudioScript.Provider>
   );
};

export const useAudio = () => useContext(AudioScript);