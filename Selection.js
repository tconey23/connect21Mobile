import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Selection = ({ setSelectionLimit, options, option, currentStage, setPrompts, setSelectionCount, setResort }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [purple] = useState('#c956ff');
  const [yellow] = useState('#fff200');
  const [green] = useState('#45d500');
  const [grey] = useState('#d4d4d4')
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

  const getStageColor = (stage) => {
    switch(stage){
      case 1: return purple
      break;
      case 2: return yellow
      break;
      case 3: return green
      break;
      default: return grey
    }
  }

  const handleSelection = () => {
    handleSelected();

    if(option.selected){
      setPrompts((prevPrompts) =>
        prevPrompts.map((prompt) =>
          prompt.title === option.title
            ? {
                ...prompt,
                color: getStageColor(prompt.stage -1),
                stage: prompt.stage -1,
                selected: false
              }
            : prompt
        )
      );
    } else {
      setPrompts((prevPrompts) =>
        prevPrompts.map((prompt) =>
          prompt.title === option.title
            ? {
                ...prompt,
                color: getStageColor(currentStage +1),
                stage: currentStage +1,
                selected: true
              }
            : prompt
        )
      );
    }

    setResort(prev => prev +1)

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
  }, [currentStage, option, options]);

  useEffect(() => {
    if(countMax){
      setSelectionLimit(countMax)
    }
  }, [countMax])




  return (
    <Animated.View
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerWidth(width);
        setContainerHeight(height);
      }}
      key={Date.now()}
      style={[styles.optionContainer, animatedButton]}
    >
      {currentStage < 3 ?
        <TouchableOpacity
          onPress={handleSelection}
          disabled={!option.selected && stageCount >= countMax || option.stage < currentStage}
          style={{
            backgroundColor: option.color,
            padding: 10,
            borderRadius: 10,
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center',
            opacity: !option.selected && stageCount >= countMax || option.stage < currentStage ? 0.4 :1,
            elevation: 10,
          }}
        >
        {containerHeight && containerWidth && fontSize ? (
          <Text style={[styles.optionText, { fontSize }]}>{option.title}</Text>
        ) : (
          <Text>Loading...</Text>
        )}
      </TouchableOpacity>
      :
        <TouchableOpacity
        onPress={handleSelection}
        disabled={true}
        style={{
          backgroundColor: option.color,
          padding: 10,
          borderRadius: 10,
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
          opacity: !option.selected && stageCount >= countMax ? 0.4 :1,
          elevation: 10,
        }}
      >
        {containerHeight && containerWidth && fontSize ? (
          <Text style={[styles.optionText, { fontSize }]}>{option.title}</Text>
        ) : (
          <Text>Loading...</Text>
        )}
      </TouchableOpacity>
      }
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