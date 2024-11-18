import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';
import React, { useState, useEffect } from 'react';
import { Vibration, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Selection = ({ setSelectionLimit, options, option, currentStage, setPrompts, setSelectionCount, setResort }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const colors = ['#d4d4d4', '#c956ff', '#fff200', '#45d500'];
  const [fontSize, setFontSize] = useState(15);

  const ANGLE = 2;
  const TIME = 80;
  const EASING = Easing.elastic(0.5);
  const buttonWobble = useSharedValue(0);

  const animatedButton = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${buttonWobble.value}deg` }],
  }));

  const getStageColor = (stage) => colors[stage] || colors[0];

  const handleSelected = () => {
    if (Vibration.vibrate) {
      Vibration.vibrate([100, 100, 100, 100]);
    }
    buttonWobble.value = 0; // Reset animation
    buttonWobble.value = withSequence(
      withTiming(-ANGLE, { duration: TIME, easing: EASING }),
      withTiming(ANGLE, { duration: TIME, easing: EASING }),
      withRepeat(withTiming(-ANGLE, { duration: TIME, easing: EASING }), 2, true),
      withTiming(0, { duration: TIME, easing: EASING })
    );
  };

  const handleSelection = () => {
    handleSelected();
    setPrompts((prevPrompts) =>
      prevPrompts.map((prompt) =>
        prompt.title === option.title
          ? {
              ...prompt,
              color: getStageColor(option.selected ? prompt.stage - 1 : currentStage + 1),
              stage: option.selected ? prompt.stage - 1 : currentStage + 1,
              selected: !option.selected,
            }
          : prompt
      )
    );
    setResort((prev) => prev + 1);
  };

  useEffect(() => {
    setSelectionLimit([6, 3, 1][currentStage] || 6);
    setSelectionCount(options.filter((opts) => opts.selected).length);
  }, [currentStage, options]);

  return (
    <Animated.View
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerWidth(width);
        setContainerHeight(height);
      }}
      key={option.title}
      style={[styles.optionContainer, animatedButton]}
    >
      <TouchableOpacity
        onPress={handleSelection}
        disabled={
          (!option.selected && options.filter((opts) => opts.selected).length >= (6, 3, 1)[currentStage]) ||
          option.stage < currentStage
        }
        style={{
          backgroundColor: option.color,
          padding: 10,
          borderRadius: 10,
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
          opacity:
            (!option.selected && options.filter((opts) => opts.selected).length >= (6, 3, 1)[currentStage]) ||
            option.stage < currentStage
              ? 0.4
              : 1,
          elevation: 10,
        }}
      >
        {containerHeight && containerWidth && fontSize ? (
          <Text style={[styles.optionText, { fontSize }]}>{option.title}</Text>
        ) : (
          <Text>Loading...</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  optionContainer: {
    width: width * 0.5,
    height: height * 0.9 / 4.5,
    padding: 10,
  },
  optionText: {
    fontFamily: 'Fredoka',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0,
  },
});

export default Selection;
