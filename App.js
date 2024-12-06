import { StyleSheet, TouchableOpacity, View, SafeAreaView, Platform, Dimensions, KeyboardAvoidingView, Text} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import AccountInfo from './AccountInfo'
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

const { width, height } = Dimensions.get('window')

export default function App() {
  const [startGame, setStartGame] = useState(false);
  const [categoryName, setCategoryName] = useState('loading');
  const [prompts, setPrompts] = useState([]);
  const [playedToday, setPlayedToday] = useState(false);
  const [betaReset, setBetaReset] = useState(false);
  const [display, setDisplay] = useState('landing');
  const [toggleHelp, setToggleHelp] = useState(false);
  const [author, setAuthor] = useState(null);
  const [betaVersion] = useState('1.36');
  const [displayName, setDisplayName] = useState('');
  const [toggleAccount, setToggleAccount] = useState(true)
  const [adjectives, setAdj] = useState(null)
  const [nouns, setNoun] = useState(null)


  const fetchOptions = async () => {
    try {
      const res = await fetch('https://secure-beach-74758-ab0619edd0f3.herokuapp.com/api/categories');
      const data = await res.json();

      const today = new Intl.DateTimeFormat('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      }).format(new Date());

      if (data) {
        const todaysCategory = Object.entries(data).find((c) => c[1].date === today);
        setPrompts(todaysCategory[1].prompts.map((p) => ({
          title: p,
          stage: 0,
          color: '#d4d4d4',
          canSelect: true,
          selected: false,
        })));
        setAuthor(todaysCategory[1].author);
        setCategoryName(todaysCategory[1].date);
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
    const today = date || new Date().toDateString();
    try {
      await AsyncStorage.setItem('playedToday', today);
      checkIfPlayedToday();
    } catch (error) {
      console.error('Error saving date:', error);
    }
  };

  const resetGame = async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const formattedYesterday = yesterday.toDateString();

    try {
      await AsyncStorage.setItem('playedToday', formattedYesterday);
      checkIfPlayedToday();
      setBetaReset(false);
      setStartGame(false);
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

  const getAdjNoun = async () => {
    const adjRes = await fetch(`https://random-word-form.herokuapp.com/random/adjective?count=10`);
    const adjData = await adjRes.json()
    adjData && setAdj(adjData)

    const animalRes =  await fetch(`https://random-word-form.herokuapp.com/random/animal?count=10`);
    const animalData = await animalRes.json()
    animalData && setNoun(animalData) 

  }
 
  useEffect(() => {
    getAdjNoun()
  }, [])
  
  const generateDisplayName = () => {
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${randomAdjective}-${randomNoun}-${Date.now()}`;
  };

  const DISPLAY_NAME_KEY = 'userDisplayName';

  const getDisplayName = async () => {
    try {
      const storedName = await AsyncStorage.getItem(DISPLAY_NAME_KEY);
      if (storedName) {
        return storedName;
      } else {
        const newDisplayName = generateDisplayName();
        await AsyncStorage.setItem(DISPLAY_NAME_KEY, newDisplayName);
        setDisplayName(newDisplayName)
        return newDisplayName;
      }
    } catch (error) {
      console.error('Error managing display name:', error);
      return null;
    }
  };

  const resetDisplayName = async () => {
    console.log("new username")
    try {
      await AsyncStorage.removeItem(DISPLAY_NAME_KEY); // Remove the display name
      getDisplayName()
    } catch (error) {
      console.error('Error resetting display name:', error);
    }
  };

  useEffect(() => {
    const initializeDisplayName = async () => {
      const name = await getDisplayName();
      setDisplayName(name);
      console.log('User Display Name:', name);
    };

    fetchOptions();
    checkIfPlayedToday();
    initializeDisplayName();
    playedToday && setDisplay('played');
  }, [playedToday]);

  useEffect(() => {
    if (startGame) {
      setDisplay('game');
    } else {
      setDisplay('landing');
      fetchOptions();
    }
  }, [startGame]);

  useEffect(() => {
    if (betaReset) {
      resetGame();
    }
  }, [betaReset, toggleHelp]);

  return (
    <View style={{ flex: 1 }}>
      <BetaAlert setToggleHelp={setToggleHelp} />
      <KeyboardAvoidingView
        style={{ height: '100%', justifyContent: 'flex-start' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'column' }}>
          {playedToday && (
            <UserPrompt setStartGame={setStartGame} playedToday={playedToday} setBetaReset={setBetaReset} />
          )}
          <View
            style={{
              elevation: 20,
              width: width,
              height: '7%',
              alignItems: 'flex-end',
              padding: 20,
              marginBottom: -10,
              marginTop: -10,
              flexDirection: 'row',
            }}
          >
            <Text style={{ color: 'white', fontSize: 10, width: '90%' }}>{betaVersion}</Text>
            <HelpIcon setToggleHelp={setToggleHelp} size={20} />
          </View>
          <TouchableOpacity onPress={() => setToggleAccount(prev => !prev)}>
            <Text style={{ fontSize: 10, color: 'white', textAlign: 'center', marginBottom: 10 }}>
              {displayName}
            </Text>
          </TouchableOpacity>
          {startGame ? (
            <GamePage
              setPrompts={setPrompts}
              prompts={prompts}
              setStartGame={setStartGame}
              saveDatePlayed={saveDatePlayed}
            />
          ) : (
            <LandingAnimation categoryName={categoryName} setStartGame={setStartGame} author={author} />
          )}
          <HelpPage toggleHelp={toggleHelp} setToggleHelp={setToggleHelp} />
          <AccountInfo resetDisplayName={resetDisplayName} toggleAccount={toggleAccount} setToggleAccount={setToggleAccount} displayName={displayName}/>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
