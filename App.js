import { StyleSheet, TouchableOpacity, View, SafeAreaView, Platform, Dimensions, KeyboardAvoidingView} from 'react-native';
import { useState, useEffect } from 'react';
import GamePage from './GamePage';
import UserPrompt from './UserPrompt';
import React from 'react';
import LandingAnimation from './LandingAnimation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BetaAlert from './BetaAlert'
import HelpPage from './HelpPage'
import Svg, {Path,} from "react-native-svg"

const HelpIcon = ({size, setToggleHelp}) => {
  return (
    <TouchableOpacity onPress={() => setToggleHelp(true)} >
      <Svg xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24" width={`${size}px`} height={`${size}px`}>
        <Path fill={'#c956ff'} d="M12,0A12,12,0,1,0,24,12,12.013,12.013,0,0,0,12,0Zm0,20a1,1,0,1,1,1-1A1,1,0,0,1,12,20Zm1.93-7.494A1.982,1.982,0,0,0,13,14.257V15a1,1,0,0,1-2,0v-.743a3.954,3.954,0,0,1,1.964-3.5,2,2,0,0,0,1-2.125,2.024,2.024,0,0,0-1.6-1.595A2,2,0,0,0,10,9,1,1,0,0,1,8,9a4,4,0,1,1,5.93,3.505Z"/>
      </Svg>
    </TouchableOpacity>
  )
}

const { width, height } = Dimensions.get('window');

export default function App() {
  const [startGame, setStartGame] = useState(false);
  const [categoryName, setCategoryName] = useState('loading');
  const [prompts, setPrompts] = useState();
  const [playedToday, setPlayedToday] = useState(false);
  const [betaReset, setBetaReset] = useState(false)
  const [display, setDisplay] = useState('landing')
  const [toggleHelp, setToggleHelp] = useState(false)

  const fetchOptions = async () => {
    try {
      const res = await fetch('https://raw.githubusercontent.com/tconey23/connect21_be/refs/heads/main/ServerData/gptResp.json');
      const data = await res.json();
      if (data) {
        setPrompts(Object.values(data)[0].map((opt) => ({
          title: opt,
          stage: 0,
          color: '#d4d4d4',
          canSelect: true,
          selected: false
        })))
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
    fetchOptions()
    checkIfPlayedToday()
    playedToday && setDisplay('played')
  }, [playedToday]);

  useEffect(() => {
    if(startGame){
      setDisplay('game')
    } else {
      setDisplay('landing')
      fetchOptions()
    }
  }, [startGame])

  useEffect(() => {
    if(betaReset) {
      resetGame()
    }
  }, [betaReset, toggleHelp])

  return (
    <View style={{flex:1}}>
      <BetaAlert setToggleHelp={setToggleHelp}/>
    <KeyboardAvoidingView
      style={{height: '100%',justifyContent: 'flex-start'}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
    <SafeAreaView style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'column'}}>
      {playedToday && <UserPrompt setStartGame={setStartGame} playedToday={playedToday} setBetaReset={setBetaReset}/>}
      <View style={{elevation: 20, width: width, height: '7%', alignItems: 'flex-end', padding: 10, marginBottom: -23}}>
        <HelpIcon setToggleHelp={setToggleHelp} size={20}/>
      </View>
      {
        startGame ?
        <GamePage setPrompts={setPrompts} prompts={prompts} setStartGame={setStartGame} saveDatePlayed={saveDatePlayed}/>
        : 
        <LandingAnimation categoryName={categoryName} setStartGame={setStartGame} />
      }
      <HelpPage toggleHelp={toggleHelp} setToggleHelp={setToggleHelp} />
    </SafeAreaView>
</KeyboardAvoidingView>
</View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    height: '93%',
    alignItems: 'center',
    justifyContent: 'center',
    width: width
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
