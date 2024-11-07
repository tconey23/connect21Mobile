
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import GamePage from './GamePage';
// import * as Font from 'expo-font';
import 'react-native-reanimated';
import React from 'react';
import LandingAnimation from './LandingAnimation';
import HexButton from './HexButton'
export default function App() {

  const [startGame, setStartGame] = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(true);

  
  // const loadFonts = async () => {
  //   await Font.loadAsync({
  //     'Roboto': require('./assets/fonts/Roboto_Mono/RobotoMono-VariableFont_wght.ttf'),
  //     'Fredoka': require('./assets/fonts/Fredoka/static/Fredoka-Regular.ttf'),
  //   });
  //   setFontsLoaded(true);
  // };

  // useEffect(() => {
  //   loadFonts()
  // }, [])
  

  return (
    <SafeAreaView style={styles.container}>
      {startGame ?
        <GamePage setStartGame={setStartGame}/>
        :
      <View style={styles.pageContainer}>
        <View style={{height: 800}}>
          <LandingAnimation setStartGame={setStartGame}/>
        </View>
      </View>}
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
  pageContainer:{
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text :{
    fontSize: 20,
    fontFamily: 'Fredoka',
    fontWeight: '500'
  },
  button: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#BDFDFF',
    padding: 10,
    borderRadius: 5,
    elevation: 15,
  }
});
