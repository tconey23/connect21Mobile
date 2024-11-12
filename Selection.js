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

const Selection = ({ option, setSelectionCount, canSelect, selectionLimit, onSelection, selected: propSelected, index, currentStage, selectionCount, stageSelections, onDeselection, optColor }) => {
  const [selected, setSelected] = useState(propSelected);
  const [color, setColor] = useState(propSelected ? '#bd80ff' : '#d4d4d4');
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [purple] = useState('#c956ff');
  const [yellow] = useState('#fff200');
  const [green] = useState('#45d500');
  const [fontSize, setFontSize] = useState(15);
  const [overrideCanSelect, setOverrideCanSelect] = useState(false)

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

  const handleSelection = () => {
    handleSelected();
    if (selected) {
      setSelected(false);
      setSelectionCount((prev) => Math.max(prev - 1, 0));
      onDeselection(option)
    } else if (canSelect && selectionCount < selectionLimit) {
      setSelected(true);
      setSelectionCount((prev) => Math.min(prev + 1, selectionLimit));
      onSelection(option);
    }
  };

  const getStageColor = (stageNum) => {
    switch (stageNum) {
      case 0:
        return purple;
      case 1:
        return yellow;
      case 2:
        return green;
      default:
        return '#d4d4d4';
    }
  };

  useEffect(() => {
    setColor(selected ? getStageColor(currentStage) : getStageColor(currentStage-1));
    if(currentStage === 2){
      //console.log('selected', option, selected, overrideCanSelect)
      setOverrideCanSelect(selected ? false : true)
    }
  }, [selected, currentStage]);

  useEffect(() => {
    setSelected(propSelected);
  }, [propSelected]);

  useEffect(() => {
    if (currentStage === 3) {
      if (stageSelections[0].includes(option) && !stageSelections[1].includes(option)) {
        setColor(getStageColor(0));
      } else if (stageSelections[1].includes(option) && !stageSelections[2].includes(option)) {
        setColor(getStageColor(1));
      } else if (stageSelections[2].includes(option)) {
        setColor(getStageColor(2));
      }
    }
  }, [currentStage, option, stageSelections, canSelect]);

  const checkCanSelect = (opt) => {
    let result

    if(canSelect){
      result = 1
    } else {
      result = 0.5
    }
    return result
  }

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
      <TouchableOpacity
        onPress={handleSelection}
        style={{
          backgroundColor: optColor ? optColor: color,
          padding: 10,
          borderRadius: 10,
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
          opacity: checkCanSelect(option),
          elevation: 10,
        }}
      >
        {containerHeight && containerWidth && fontSize ? (
          <Text style={[styles.optionText, { fontSize }]}>{option}</Text>
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