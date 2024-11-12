import { StyleSheet, Text, View, SafeAreaView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import GamePage from './GamePage';
import UserPrompt from './UserPrompt';
import React from 'react';
import LandingAnimation from './LandingAnimation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BetaAlert from './BetaAlert'
import HelpPage from './HelpPage'

export default function App() {
  const [startGame, setStartGame] = useState(false);
  const [categoryName, setCategoryName] = useState();
  const [prompts, setPrompts] = useState();
  const [playedToday, setPlayedToday] = useState(false);
  const [betaReset, setBetaReset] = useState(false)
  const [toggleHelp, setToggleHelp] = useState(false)

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
    // console.log('saving date')
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

  const resetGame = async () => {
    console.log('resetting')
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Set the date to yesterday
    const formattedYesterday = yesterday.toDateString(); // Format it as a string
    
    try {
      await AsyncStorage.setItem('playedToday', formattedYesterday); // Save yesterday's date
      checkIfPlayedToday();
      setBetaReset(false)
      setStartGame(false)
    } catch (error) {
      console.error('Error resetting game date:', error);
    }
  };

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

  useEffect(() => {
    if(betaReset) {
      console.log(betaReset)
      resetGame()
    }
  }, [betaReset])

  return (
    <SafeAreaView style={styles.container}>
      <BetaAlert setToggleHelp={setToggleHelp}/>
      <HelpPage setToggleHelp={setToggleHelp} toggleHelp={toggleHelp}/>
      {playedToday && <UserPrompt setStartGame={setStartGame} playedToday={playedToday} setBetaReset={setBetaReset}/>}
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
