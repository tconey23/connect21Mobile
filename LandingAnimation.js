import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import HexButton from './HexButton';
import { useSpring, animated } from "@react-spring/native";
import PlayButton from './PlayButton';
import DatePicker from './components/DatePicker';

const { width, height } = Dimensions.get('window');

const LandingAnimation = ({ setStartGame, categoryName, author, setGameDate, gameDate }) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const titleText = '21Things';


  const AnimatedHexContainer = animated(View);

  const spin = useSpring({
    from: { rotate: "0deg" },
    to: async (next) => {
      if (isSpinning) {
        await next({ rotate: "360deg" });
      }
    },
    config: {
      tension: 10,
      friction: 20,
    },
    reset: true,
    onRest: () => setIsSpinning(false),
  });

  const handleSpin = () => {
    setIsSpinning(true)
  };


  return (
    <View style={styles.container}>
      <AnimatedHexContainer
        style={[styles.hexContainer, { transform: [{ rotate: spin.rotate }] }]}
      >
        <TouchableOpacity onPress={handleSpin}>
          <HexButton size={200} />
        </TouchableOpacity>
      </AnimatedHexContainer>

      <View style={styles.titleContainer}>
        {titleText.split('').map((char, i) => (
          <Text key={i} style={styles.text}>
            {char}
          </Text>
        ))}
      </View>

      <DatePicker gameDate={gameDate} setGameDate={setGameDate} categoryName={categoryName} author={author}/>

      <PlayButton setStartGame={setStartGame}/>

    </View>
  );
};

export default LandingAnimation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 10,
    flex: 1,
  },
  text: {
    fontSize: 50,
    fontFamily: 'Fredoka',
    textAlign: 'center',
    alignSelf: 'center',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    marginTop: -50,
    color: 'black'
  },
  titleContainer: {
    flexDirection: 'row',
    paddingVertical: 30,
  },
  hexContainer: {
    width: 200,
    height: 200,
    marginTop: 0,
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Fredoka',
    fontWeight: '800',
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 15,
  },
  catText: {
    fontSize: 30,
    width: '100%',
    textAlign: 'center',
  },
  categoryWrapper: {
    backgroundColor: 'white',
    height: height * 0.1,
    width: width * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 20,
    marginTop: -80,
  },
});
