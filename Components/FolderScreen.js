import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
  Alert,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const folderWidth = (screenWidth - 40) / 2; 

const FolderScreen = ({ navigation }) => {
  const [folders, setFolders] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [listKey, setListKey] = useState('grid');

  useEffect(() => {
    const loadFolders = async () => {
      const storedFolders = await AsyncStorage.getItem('folders');
      if (storedFolders) {
        setFolders(JSON.parse(storedFolders));
      }
    };
    loadFolders();
  }, []);

  const saveFolders = async (newFolders) => {
    setFolders(newFolders);
    await AsyncStorage.setItem('folders', JSON.stringify(newFolders));
  };

  const handleAddFolder = () => {
    if (folderName.trim() === '') {
      Alert.alert('Error', 'Please enter a folder name');
      return;
    }
    const newFolder = { name: folderName, images: [] };
    const updatedFolders = [...folders, newFolder];
    saveFolders(updatedFolders);
    setFolderName('');
    setModalVisible(false);
  };

  const handleAddImageToFolder = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.8,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.error('ImagePicker Error:', response.errorMessage);
        } else {
          const source = { uri: response.assets[0].uri };
          const updatedFolders = folders.map((folder) => {
            if (folder.name === selectedFolder.name) {
              return { ...folder, images: [...folder.images, source] };
            }
            return folder;
          });
          saveFolders(updatedFolders);
          setSelectedFolder((prev) => ({
            ...prev,
            images: [...prev.images, source],
          }));
          setListKey(`grid-${Date.now()}`);
        }
      }
    );
  };

  const handleOpenFolder = (folder) => {
    setSelectedFolder(folder);
  };


  if (selectedFolder) {
    return (
      <ImageBackground source={require('../assets/back.png')} style={styles.backgroundImage}>
        <SafeAreaView style={styles.container}>
          {selectedFolder.images.length === 0 ? (
            <Text style={styles.noImagesText}>No images added yet</Text>
          ) : (
            <FlatList
              data={selectedFolder.images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Image source={item} style={styles.roundedImage} />
              )}
              key={listKey}
              numColumns={2}
              showsVerticalScrollIndicator={false}
            />
          )}

          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={handleAddImageToFolder}>
              <Text style={styles.buttonText}>Add Image</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setSelectedFolder(null)}
            >
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }// Иначе показываем список папок:
  return (
    <ImageBackground source={require('../assets/back.png')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={folders}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.folder}
              onPress={() => handleOpenFolder(item)}
            >
              <ImageBackground
                source={require('../assets/folder.png')}
                style={styles.folderBackground}
                imageStyle={styles.roundedFolderIcon}
              />
              <Text style={styles.folderText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          numColumns={2}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Add Folder</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>

        {isModalVisible && (
          <View style={styles.modal}>
            <Text style={styles.modalText}>Please, enter a folder name</Text>
            <TextInput
              style={styles.input}
              value={folderName}
              onChangeText={setFolderName}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddFolder}>
              <Text style={styles.modalButtonText}>Add Folder</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    
    padding: screenWidth * 0.05,
  },
  folder: {
    width: folderWidth,
    height: folderWidth,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderBackground: {
    marginTop:10,
    width: '95%',
    height: '95%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundedFolderIcon: {
    borderRadius: 10,
  },
  folderText: {
    fontSize: screenWidth * 0.06,
    color: '#5DADE2',
    fontWeight:'bold',
    textAlign: 'center',
    marginTop: -5,
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },

  button: {
    backgroundColor: '#72c7c5', 
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // Для ровности можно добавить небольшую тень:
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
    // Если вам нужно, чтобы кнопки были одинаковой ширины
    // и не «плясали», можно задать ширину
    // width: '45%', 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  modal: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    backgroundColor: '#ffff',
    padding: screenHeight * 0.02,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#72c7c5',
  },
  modalText: {
    fontSize: screenWidth * 0.05,
    color: '#72c7c5',
    marginBottom: screenHeight * 0.02,
    textAlign: 'center',
  },
  input: {
    height: screenHeight * 0.06,
    borderColor: '#72c7c5', // тоже меняем
    borderWidth: 1,
    borderRadius: 5,
    color: '#72c7c5',paddingHorizontal: screenWidth * 0.03,
    marginBottom: screenHeight * 0.02,
  },
  modalButton: {
    backgroundColor: '#72c7c5',
    padding: screenHeight * 0.02,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: screenWidth * 0.05,
    color: '#fff',
    fontWeight: 'bold',
  },
  roundedImage: {
    width: screenWidth * 0.45,
    height: screenWidth * 0.45,
    margin: 9,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#72c7c5',
  },
  noImagesText: {
    marginTop: screenHeight * 0.4,
    marginBottom: screenHeight * 0.08,
    alignSelf: 'center',
    fontSize: screenWidth * 0.08,
    color: '#72c7c5',
  },
});

export default FolderScreen;