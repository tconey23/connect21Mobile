import { StyleSheet, Text, View, SafeAreaView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import GamePage from './GamePage';
import UserPrompt from './UserPrompt';
import React from 'react';
import LandingAnimation from './LandingAnimation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [startGame, setStartGame] = useState(false);
  const [categoryName, setCategoryName] = useState();
  const [prompts, setPrompts] = useState();
  const [playedToday, setPlayedToday] = useState(false);

  const fetchOptions = async () => {
    try {
      const res = await fetch('https://raw.githubusercontent.com/tconey23/connect21_be/refs/heads/main/ServerData/gptResp.json');
      const data = await res.json();
      if (data) {
        setPrompts(Object.values(data)[0]);
        setCategoryName(Object.keys(data)[0]);
      }
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const checkIfPlayedToday = async () => {
    const lastPlayedDate = await getDatePlayed();
    const today = new Date().toDateString();

    setPlayedToday(lastPlayedDate === today);
  };

  const saveDatePlayed = async (date) => {
    console.log('saving date')
    let today 
    if(date){
      today = date
    } else {
      today = new Date().toDateString();
    } 
    
    try {
      await AsyncStorage.setItem('playedToday', today);
      checkIfPlayedToday()
    } catch (error) {
      console.error('Error saving date:', error);
    }
  };

  // saveDatePlayed('Mon Nov 10 2024')

  const getDatePlayed = async () => {
    try {
      const storedDate = await AsyncStorage.getItem('playedToday');
      return storedDate;
    } catch (error) {
      console.error('Error retrieving date:', error);
    }
  };


  useEffect(() => {
    fetchOptions();
    checkIfPlayedToday();
  }, [playedToday]);

  return (
    <SafeAreaView style={styles.container}>
      {playedToday && <UserPrompt />}
      {startGame ? (
        <GamePage prompts={prompts} setStartGame={setStartGame} saveDatePlayed={saveDatePlayed}/>
      ) : (
        <View style={styles.pageContainer}>
          <View style={{ height: 800 }}>
            <LandingAnimation categoryName={categoryName} setStartGame={() => {
              setStartGame(true);
            }} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '95%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageContainer: {
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontFamily: 'Fredoka',
    fontWeight: '500',
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#BDFDFF',
    padding: 10,
    borderRadius: 5,
    elevation: 15,
  },
});
