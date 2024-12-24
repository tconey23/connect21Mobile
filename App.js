import { TouchableOpacity, View, SafeAreaView, Platform, Dimensions, KeyboardAvoidingView, Text} from 'react-native';
import { useState, useEffect} from 'react';
import AccountInfo from './AccountInfo'
import GamePage from './GamePage';
import UserPrompt from './UserPrompt';
import React from 'react';
import LandingAnimation from './LandingAnimation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BetaAlert from './BetaAlert'
import HelpPage from './HelpPage'
import {Icon} from '@rneui/themed'
import Friends from './Friends'

const { width, height } = Dimensions.get('window')

export default function App() {
  const [startGame, setStartGame] = useState(false);
  const [categoryName, setCategoryName] = useState('loading');
  const [prompts, setPrompts] = useState([]);
  const [playedToday, setPlayedToday] = useState(false);
  const [betaReset, setBetaReset] = useState(false);
  const [display, setDisplay] = useState('landing');
  const [toggleHelp, setToggleHelp] = useState(false);
  const [toggleFriends, setToggleFriends] = useState(false);
  const [author, setAuthor] = useState(null);
  const [betaVersion] = useState('1.37');
  const [displayName, setDisplayName] = useState('');
  const [toggleAccount, setToggleAccount] = useState(false)
  const [adjectives, setAdj] = useState(null)
  const [nouns, setNoun] = useState(null)
  const [gameDate, setGameDate] = useState(null)
  const [devProd, setDevProd] = useState('prod')
  const [userData, setUserData] = useState()

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

        let todaysCategory

        if(gameDate){
          todaysCategory = Object.entries(data).find((c) => c[1].date === gameDate);
        } else {
          todaysCategory = Object.entries(data).find((c) => c[1].date === today)
        }
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


  const handleDeepLink = (event) => {
    const url = event.url;
    const params = new URLSearchParams(url.split('?')[1]); // Extract query parameters
    const path = params.get('path'); // Extract the "path" parameter

    if (path) {
      // Navigate to the GameDetails screen with the extracted path
      navigation.navigate('GameDetails', { gamePath: path });
    }
  };
  

  const fetchUserData = async (path) => {
    let endpoint
    devProd === 'dev' ? endpoint = 'https://secure-beach-74758-ab0619edd0f3.herokuapp.com' : endpoint = 'http://10.0.0.155:5001' 
    try {
      const res = await fetch(`${endpoint}/api/getdbpath?path=${path}`);
      const data = await res.json();
      
       if (data) {
        return Object.keys(data)
       }
    } catch (error) { 
      console.error('Error fetching options:', error);   
    }
  }

  useEffect(() => {
    if(gameDate){
      fetchOptions()
    }
  }, [gameDate])

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
      await AsyncStorage.removeItem(DISPLAY_NAME_KEY);
      getDisplayName()
    } catch (error) {
      console.error('Error resetting display name:', error);
    }
  };

  useEffect(() => {
    const initializeDisplayName = async () => {
      const name = await getDisplayName();
      setDisplayName(name);
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
    if (toggleFriends) {
      const fetchData = async () => {
        const users = await fetchUserData('users/');
        console.log(users);
        setUserData(users);
      };
      fetchData();
    }
  }, [betaReset, toggleHelp, toggleFriends]);

  return (
    <View 
      style={{ flex: 1 }}>
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
              flexDirection: 'row',
              backgroundColor: '#3a65ba',
              elevation: 30
            }}
          >
            <View style={{width: '25%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{ color: 'white', fontSize: 12}}>{`Beta v${betaVersion}`}</Text>
            </View>
            <View style={{width: '40%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => setToggleAccount(prev => !prev)}>
                <Text style={{ fontSize: 12, color: 'white', textAlign: 'center', marginBottom: 10 }}>
                  {displayName}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{width: '20%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => setToggleFriends(true)}>
                <Icon name='users' type='font-awesome'/>
              </TouchableOpacity>
            </View>

            <View style={{width: '20%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => setToggleHelp(true)}>
                <Icon name='help' type='material'/>
              </TouchableOpacity>
            </View>
          </View>
          {startGame ? ( 
            <GamePage
              setPrompts={setPrompts}
              prompts={prompts}
              setStartGame={setStartGame}
              saveDatePlayed={saveDatePlayed}
              displayName={displayName}
            />
          ) : (
            <LandingAnimation gameDate={gameDate} setGameDate={setGameDate} categoryName={categoryName} setStartGame={setStartGame} author={author} />
          )}
          <Friends fetchUserData={fetchUserData} devProd={devProd} userData={userData} toggleFriends={toggleFriends} setToggleFriends={setToggleFriends} />
          <HelpPage toggleHelp={toggleHelp} setToggleHelp={setToggleHelp} />
          <AccountInfo devProd={devProd} resetDisplayName={resetDisplayName} toggleAccount={toggleAccount} setToggleAccount={setToggleAccount} displayName={displayName}/>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}
