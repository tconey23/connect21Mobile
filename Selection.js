
import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, TouchableOpacity, Dimensions, View } from 'react-native';
import { useSpring, animated } from "@react-spring/native";

const { width, height } = Dimensions.get('window');

const Selection = ({ setSelectionLimit, options, option, currentStage, setPrompts, setSelectionCount, setResort, selectionCount, selectionLimit }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [isWobbling, setIsWobbling] = useState(false);
  const [optionColor, setOptionColor] = useState()
  const [optionOpacity, setOptionOpacity] = useState(1)
  const [optionDisabled, setOptionDisabled] = useState(false)
  const colors = ['#d4d4d4', '#c956ff', '#fff200', '#45d500'];
  const [fontSize, setFontSize] = useState(15);
  const getStageColor = (stage) => colors[stage] || colors[0];

  const AnimatedSelection = animated(TouchableOpacity);

  const props = useSpring({
    to: async (next) => {
      if (isWobbling) {
        setOptionColor(option.color)
        for (let i = 0; i < 3; i++) {
          await next({ rotate: "10deg", config: { duration: 80 } }); // 100ms per step
          await next({ rotate: "-10deg", config: { duration: 80 } });
        }
        await next({ rotate: "0deg", config: { duration: 50 } });
        setIsWobbling(false);
      }
    },
    from: { rotate: "0deg" },
    reset: true,
  });
  
  const handleSelected = () => {
    setIsWobbling(true);
  };

  let animatedButton

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

  useEffect(() => {
    setOptionColor(option.color)
  }, [])

  useEffect(() =>{
    if(currentStage === 2 && option.stage === 1){
      setOptionOpacity(0.4)
      setOptionDisabled(true)
    }else if(option && !option.selected && selectionCount >= selectionLimit){
      setOptionOpacity(0.4)
      setOptionDisabled(true)
    } else if(currentStage === 3 ){
      setOptionOpacity(1)
      setOptionDisabled(true)
    }else {
      setOptionOpacity(1)
      setOptionDisabled(false)
    }
  }, [option, selectionCount, selectionLimit])

  return (
    <View
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerWidth(width);
        setContainerHeight(height);
      }}
      key={option.title}
      style={[styles.optionContainer]}
    >
      {optionColor && 
      <AnimatedSelection
      key={optionColor}
        onPress={handleSelection}
        disabled={optionDisabled}
        style={{
          backgroundColor: optionColor,
          padding: 10,
          borderRadius: 10,
          alignItems: 'center',
          height: '100%',
          justifyContent: 'center',
          opacity: optionOpacity,
          elevation: 10,
          transform: [{ rotate: props.rotate }]
        }}
      >
        {containerHeight && containerWidth && fontSize ? (
          <Text style={[styles.optionText, { fontSize }]}>{option.title}</Text>
        ) : (
          <Text>Loading...</Text>
        )}
      </AnimatedSelection>}
    </View>
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
