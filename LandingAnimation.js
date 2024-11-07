import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import HexButton from './HexButton';
// import * as Font from 'expo-font';

const LandingAnimation = ({ setStartGame }) => {
  const [purple] = useState('#c956ff');
  const [yellow] = useState('#fff200');
  const [green] = useState('#45d500');
  const [fontsLoaded, setFontsLoaded] = useState(true);

  // const loadFonts = async () => {
  //   await Font.loadAsync({
  //     'Roboto': require('./assets/fonts/Roboto_Mono/RobotoMono-VariableFont_wght.ttf'),
  //     'Fredoka': require('./assets/fonts/Fredoka/static/Fredoka-Regular.ttf'),
  //   });
  //   setFontsLoaded(true);
  // };

  // useEffect(() => {
  //   loadFonts();
  // }, []);

  const ANGLE = 360;
  const TIME = 4000;
  const EASING = Easing.elastic(0.01);
  const HEXEASING = Easing.elastic(0.01)
  const textShadowColors = [purple, purple, purple, yellow, yellow, green];

  const titleText = '21Things';
  const rotationValues = titleText.split('').map(() => useSharedValue(0));
  const hexRotationValues = useSharedValue(0);
  const buttonWobble = useSharedValue(1);

  const animatedText = (rotationValue) =>
    useAnimatedStyle(() => ({
      transform: [{ rotateX: `${rotationValue.value}deg` }],
    }));

  const animatedHex = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${hexRotationValues.value}deg` }],
  }));

  const animatedButton = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${buttonWobble.value}deg`}],
  }));

  useEffect(() => {
    rotationValues.forEach((rotation, index) => {
      rotation.value = withDelay(
        index * 400,
        withRepeat(
          withSequence(
            withTiming(-ANGLE, { duration: TIME / 2, easing: EASING }),
            withTiming(ANGLE, { duration: TIME / 2, easing: EASING })
          ),
          1,
          true
        )
      );
    });

    let hexAngle = 60
    let hexTiming = 2000

    hexRotationValues.value = withRepeat(
      withSequence(
        withTiming(0, { duration: hexTiming, easing: HEXEASING }),
        withTiming(hexAngle *2, { duration: hexTiming, easing: HEXEASING }),
        withTiming(hexAngle *10, { duration: hexTiming, easing: HEXEASING }),
        withTiming(hexAngle *4, { duration: hexTiming, easing: HEXEASING }),
        withTiming(hexAngle *5, { duration: hexTiming, easing: HEXEASING }),
        withTiming(hexAngle, { duration: hexTiming, easing: HEXEASING }), 
        withTiming(hexAngle *3, { duration: hexTiming, easing: HEXEASING }),

      ),
      -1, // Infinite repeat
      true // Alternate direction
    );

    // Button pulsing animation
    buttonWobble.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 100, easing: EASING }), // Move left
        withTiming(5, { duration: 100, easing: EASING }),  // Move right
        withTiming(-5, { duration: 100, easing: EASING }), // Move left
        withTiming(0, { duration: 100, easing: EASING }),  // Move right
        withDelay(1000, withTiming(0, { duration: 0 })) // Add a 500ms delay after the wobble
      ),
      -1, // Infinite repeat
      true // Alternate direction
    );
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.hexContainer, animatedHex]}>
        <HexButton size={200} />
      </Animated.View>
      <View style={styles.titleContainer}>
        {titleText.split('').map((char, i) => (
          <Animated.Text
            key={i}
            style={[
              styles.text,
              animatedText(rotationValues[i]),
              {
                textShadowColor: isNaN(char) ? textShadowColors[i - 2] : 'black',
              },
            ]}
          >
            {char}
          </Animated.Text>
        ))}
      </View>
      <Animated.View style={animatedButton}>
        <TouchableOpacity onPress={() => setStartGame(true)} style={styles.button}>
          {fontsLoaded && <Text style={styles.buttonText}>PLAY!</Text>}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default LandingAnimation;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  text: {
    fontSize: 50,
    fontFamily: 'Fredoka',
    textAlign: 'center',
    alignSelf: 'center',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  titleContainer: {
    flexDirection: 'row',
  },
  hexContainer: {
    width: 200,
    height: 200,
    marginTop: 0,
    marginBottom: 50,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Fredoka',
    fontWeight: '800',
  },
  button: {
    backgroundColor: '#BDFDFF',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 15,
  },
});
