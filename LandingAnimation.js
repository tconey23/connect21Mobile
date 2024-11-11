import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import HexButton from './HexButton';

const { width, height } = Dimensions.get('window')

const LandingAnimation = ({ setStartGame, categoryName }) => {
  const [purple] = useState('#c956ff');
  const [yellow] = useState('#fff200');
  const [green] = useState('#45d500');
  const [fontsLoaded, setFontsLoaded] = useState(true);
  const [dateToday] = useState(new Date().toDateString())

  const SCALE_UP = 1.5;
  const TIME = 400;
  const EASING = Easing.elastic(0.3);
  const textShadowColors = [purple, purple, purple, yellow, yellow, green];
  const HEXEASING = Easing.elastic(0.01)

  const titleText = '21Things';
  const scaleValues = titleText.split('').map(() => useSharedValue(1));
  const hexRotationValues = useSharedValue(0);
  const buttonWobble = useSharedValue(1);

  const animatedText = (scaleValue) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: scaleValue.value }],
    }));

  const animatedHex = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${hexRotationValues.value}deg` }],
  }));

  const animatedButton = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${buttonWobble.value}deg`}],
  }));

  useEffect(() => {
    scaleValues.forEach((scale, index) => {
      scale.value = withDelay(
        index * 200,
        withRepeat(
          withSequence(
            withTiming(SCALE_UP, { duration: TIME, easing: EASING }),
            withTiming(1, { duration: TIME, easing: EASING })
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
      2, 
      true 
    );

    buttonWobble.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 100, easing: EASING }),
        withTiming(5, { duration: 100, easing: EASING }),
        withTiming(-5, { duration: 100, easing: EASING }),
        withTiming(0, { duration: 100, easing: EASING }),
        withDelay(1000, withTiming(0, { duration: 0 }))
      ),
      -1,
      true
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
              animatedText(scaleValues[i]),
              {
                textShadowColor: isNaN(char) ? textShadowColors[i - 2] : 'black',
              },
            ]}
          >
            {char}
          </Animated.Text>
        ))}
      </View>
      <View style={styles.categoryWrapper}>
        <Text style={styles.catText}>{categoryName}</Text>
        <Text style={[styles.catText, {fontSize: 18}]}>{dateToday}</Text>
      </View>
      <Animated.View style={animatedButton}>
        <TouchableOpacity onPress={() => setStartGame(true)} style={[styles.button, {backgroundColor: purple}]}>
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
    marginTop: -50
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
    backgroundColor: 'lightgray',
    height: height * 0.1,
    width: width * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    elevation: 30,
    borderRadius: 20,
    marginTop: -80
  }
});
