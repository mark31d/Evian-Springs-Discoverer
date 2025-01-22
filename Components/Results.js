import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert, Share ,ImageBackground, SafeAreaView, ScrollView} from 'react-native';
import { UserContext } from './UserContext'; // Импортируем контекст пользователя
import { useNavigation } from '@react-navigation/native';
// Пример списка других игроков
const generateRandomPlayers = (count) => {
  const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Hannah', 'Ian', 'Jack'];
  const players = [];

  for (let i = 0; i < count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const score = Math.floor(Math.random() * 1000);
    players.push({ id: i.toString(), name, score });
  }

  return players;
};

const Results = () => {
  const { balance } = useContext(UserContext); // Получаем баланс из контекста
  const [players, setPlayers] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    // Генерируем список других игроков при монтировании компонента
    const randomPlayers = generateRandomPlayers(10);
    setPlayers(randomPlayers);
  }, []);

  const onShare = async () => {
    try {
      const message = `My Balance: ${balance} \nCheck out my score in the Evin Springs Discoverer !`;
      const result = await Share.share({
        message,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while sharing.');
    }
  };

  const renderPlayer = ({ item }) => (
    <View style={styles.playerItem}>
      <Text style={styles.playerName}>{item.name}:  </Text>
      <Text style={styles.playerScore}>{item.score}  </Text><Image source={require('../assets/coin.png')} style={styles.coinIcon} />
    </View>
  );

  return (
    <ImageBackground source={require('../assets/back.png')} style={styles.background}>
    <SafeAreaView style={styles.container}>
    <TouchableOpacity style={styles.backButton} onPress={()=> navigation.goBack()}>
                  <Image source={require('../assets/x.png')} style={styles.backIcon} />
                </TouchableOpacity>
      
      <View style={styles.balanceContainer}>
        
        <Text style={styles.balanceText}>{balance} </Text><Image source={require('../assets/coin.png')} style={styles.coinIcon} />
      </View>

     
      <Text style={styles.title}>Leaderboard</Text>
      <FlatList
        data={players}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      {/* Кнопка "Share" */}
      <TouchableOpacity style={styles.shareButton} onPress={onShare}>
        <Text style={styles.shareButtonText}>Share</Text>
      </TouchableOpacity>
     
    </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-end',
   padding:8,
  },
  backIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    
    alignItems: 'center',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop:10,
  },
  coinIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 10,
  },
  balanceText: {
   textAlign:'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007f7d',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007f7d',
  },
  listContainer: {
    width: 300,
    paddingBottom: 20,
  },
  playerItem: {
    borderWidth:3,
    borderColor:'#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#72c7c5',
    padding: 15,
    borderRadius: 12,
    marginVertical: 5,
    marginHorizontal:20,
  },
  playerName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  playerScore: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#72c7c5',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007f7d',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    marginTop: 10,
  },
  shareButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Results;