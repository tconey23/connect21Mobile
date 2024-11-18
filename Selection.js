import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Selection = ({ options, option, selected: propSelected, index, currentStage, setPrompts, setSelectionCount }) => {
  const [selected, setSelected] = useState(propSelected);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [purple] = useState('#c956ff');
  const [yellow] = useState('#fff200');
  const [green] = useState('#45d500');
  const [fontSize, setFontSize] = useState(15);
  const [countMax, setCountMax] = useState();
  const [stageCount, setStageCount] = useState(0)


  const ANGLE = 2;
  const TIME = 80;
  const EASING = Easing.elastic(0.5);

  const buttonWobble = useSharedValue(0);

  const animatedButton = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${buttonWobble.value}deg` }],
  }));

  const handleSelected = () => {
    buttonWobble.value = withSequence(
      withTiming(-ANGLE, { duration: TIME, easing: EASING }),
      withTiming(ANGLE, { duration: TIME, easing: EASING }),
      withTiming(-ANGLE, { duration: TIME, easing: EASING }),
      withRepeat(
        withTiming(ANGLE, { duration: TIME, easing: EASING }),
        2,
        true
      ),
      withTiming(0, { duration: TIME, easing: EASING })
    );
  };

  const getStageColor = () => {
    console.log(currentStage)
    switch(currentStage){
      case 0: return purple
      break;
      case 1: return yellow
      break;
      case 2: return green
      break;
      default: return purple
    }
  }

  const handleSelection = () => {
    handleSelected();
    setPrompts((prevPrompts) =>
      prevPrompts.map((prompt) =>
        prompt.title === option.title
          ? {
              ...prompt,
              color: getStageColor(),
              stage: currentStage+1,
              selected: !prompt.selected
            }
          : prompt
      )
    );
  };

  useEffect(() => {
    switch(currentStage){
      case 0: setCountMax(6)
      break;
      case 1: setCountMax(3)
      break;
      case 2: setCountMax(1)
      break;
      default: 6
    }

    setStageCount(options.filter((opts) => opts.selected === true).length)
    setSelectionCount(options.filter((opts) => opts.selected === true).length)

  }, [selected, currentStage, option, options]);

  useEffect(() => {
    setSelected(propSelected);
  }, [propSelected]);

  return (
    <Animated.View
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerWidth(width);
        setContainerHeight(height);
      }}
      key={index}
      style={[styles.optionContainer, animatedButton]}
    >
      {<TouchableOpacity
        onPress={handleSelection}
        disabled={!option.selected && stageCount >= countMax}
        style={{
          backgroundColor: option.selected ? option.color : '#d4d4d4',
          padding: 10,
          borderRadius: 10,
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
          opacity: 1,
          elevation: 10,
        }}
      >
        {containerHeight && containerWidth && fontSize ? (
          <Text style={[styles.optionText, { fontSize }]}>{option.title}</Text>
        ) : (
          <Text>Loading...</Text>
        )}
      </TouchableOpacity>}
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