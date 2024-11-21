import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import Selection from './Selection';

const Stage = ({
  setPrompts,
  currentStage,
  options,
  setSelectionCount,
  setSelectionLimit,
}) => {
  const [resort, setResort] = useState(2);

  useEffect(() => {
    if (currentStage > 0 && typeof setPrompts === 'function') {
      setPrompts((prevPrompts) =>
        prevPrompts.map((prompt) =>
          prompt.selected
            ? {
                ...prompt,
                stage: currentStage,
                selected: !prompt.selected,
              }
            : prompt
        )
      );
    } else {
      console.warn('setPrompts is not a function or currentStage <= 0');
    }
  }, [currentStage, setPrompts]);

  const validOptions = Array.isArray(options) ? options : [];

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        key={resort}
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          height: '75%',
        }}
      >
        {validOptions
          .filter((opt) => (currentStage === 0 ? opt : opt.stage >= 1))
          .sort((a, b) => {
            const stageA = a.stage ?? Infinity;
            const stageB = b.stage ?? Infinity;

            return stageB - stageA;
          })
          .map((opt, i) => {
            if (i < 21) {
              return (
                <Selection
                  key={`stage ${i}`}
                  currentStage={currentStage}
                  setSelectionCount={setSelectionCount}
                  option={opt}
                  options={validOptions}
                  setPrompts={setPrompts}
                  setSelectionLimit={setSelectionLimit}
                  setResort={setResort}
                />
              );
            }
            return null;
          })}
      </View>
    </ScrollView>
  );
};

export default Stage;
