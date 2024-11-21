import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import HexButton from './HexButton';

const { width, height } = Dimensions.get('window')

const LandingAnimation = ({ setStartGame, categoryName }) => {
  const [purple] = useState('#c956ff');
  const [dateToday] = useState(new Date().toDateString())

  const titleText = '21Things';

  let animatedHex
  let animatedButton

  return (
    <View style={styles.container}>
      <View style={[styles.hexContainer, animatedHex]}>
        <TouchableOpacity>
          <HexButton size={200} />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        {titleText.split('').map((char, i) => (
          <Text
            key={i}
            style={[
              styles.text
            ]}
          >
            {char}
          </Text>
        ))}
      </View>
      <View style={styles.categoryWrapper}>
        <Text style={styles.catText}>{categoryName}</Text>
        <Text style={[styles.catText, {fontSize: 18}]}>{dateToday}</Text>
      </View>
      <View style={animatedButton}>
        <TouchableOpacity onPress={() => setStartGame(true)} style={[styles.button, {backgroundColor: purple}]}>
          <Text style={styles.buttonText}>PLAY!</Text>
        </TouchableOpacity>
      </View>
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
    flex: 1
  },
  text: {
    fontSize: 50,
    fontFamily: 'Fredoka',
    textAlign: 'center',
    alignSelf: 'center',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    marginTop: -50,
  },
  titleContainer: {
    flexDirection: 'row',
    paddingVertical: 30
  },
  hexContainer: {
    width: 200,
    height: 200,
    marginTop: 0,
    marginBottom: 50,
    justifyContent: 'center',
    alignItems: 'center'
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
    width: "100%",
    textAlign: 'center'
  },
  categoryWrapper:{
    backgroundColor: 'white',
    height: height * 0.1,
    width: width * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 20,
    marginTop: -80
  }
});
